import { ApiError, uploadOnCloudinary } from '../utils/index.js';
import { Partner, Document } from '../models/index.js';

class PartnerService {
  /**
   * Checks if a partner with the given business name or document number already exists.
   * @param {string} businessName - The business name to check.
   * @param {string} documentNumber - The document number to check.
   * @throws {ApiError} Throws error if partner with given business name or document number exists.
   */
  async checkBusinessDetailExist(businessName, documentNumber) {
    const businessDetailExist = await Partner.findOne({
      $or: [{ businessName }, { documentNumber }],
    });

    if (businessDetailExist) {
      throw new ApiError(409, 'businessName or documentNumber of partner already exist');
    }
  }

  /**
   * Validates if the provided document type ID exists in the Document collection.
   * This ensures the document type is valid before associating it with a partner.
   * @param {string} documentTypeId - The document type ID to validate.
   * @throws {ApiError} Throws error if document type ID is invalid.
   */
  async checkDocumentTypeIdValid(documentTypeId) {
    const document = await Document.findById(documentTypeId);

    if (!document) {
      throw new ApiError(400, 'Invalid document type model id');
    }
  }

  /**
   * Retrieves the local file path of the specified field from uploaded files.
   * @param {object} files - Uploaded files object.
   * @param {string} fieldName - Name of the field to retrieve file path.
   * @returns {string|null} File local path if found, otherwise null.
   */
  fileLocalPath(files, fieldName) {
    return files && Array.isArray(files[fieldName]) && files[fieldName].length > 0
      ? files[fieldName][0].path // file local path found return it
      : null; // file local path not found
  }

  /**
   * Uploads the document front and back images to Cloudinary.
   * @param {object} files - Uploaded files object containing document images.
   * @returns {Promise<{ documentFrontUrl: string, documentBackUrl: string }>} Object with Cloudinary URLs of uploaded images.
   * @throws {ApiError} Throws error if document front or back image upload fails.
   */
  async uploadFile(files) {
    // find the document both front and back file local path
    const documentFrontLocalPath = this.fileLocalPath(files, 'documentFrontImage');
    const documentBackLocalPath = this.fileLocalPath(files, 'documentBackImage');

    // if document front and back both file local path is not present
    if (!documentFrontLocalPath || !documentBackLocalPath) {
      throw new ApiError(401, 'Document front or back local file path not found');
    }

    // upload documentFront and documentBack on cloudinary
    const [documentFront, documentBack] = await Promise.all([
      uploadOnCloudinary(documentFrontLocalPath),
      uploadOnCloudinary(documentBackLocalPath),
    ]);

    // if document front and back both file not able to upload on cloudinary
    if (!documentFront || !documentBack) {
      throw new ApiError(500, 'Failed to upload documentFront or documentBack file on cloudinary');
    }

    // if both document front and back file upload then return both url
    return { documentFrontUrl: documentFront.url, documentBackUrl: documentBack.url };
  }

  /**
   * Creates a new partner with the provided details.
   * @param {object} partnerDetails - Partner details to create a new partner.
   * @param {object} files - Uploaded files object containing document images.
   * @returns {Promise<object>} Newly created partner object.
   * @throws {ApiError} Throws error if partner creation fails.
   */
  async createPartner(partnerDetails, files) {
    try {
      // we have check in user service that partner already exist, no need to check here

      // we have to check that buisness name and document number already exist
      await this.checkBusinessDetailExist(
        partnerDetails.businessName,
        partnerDetails.documentNumber,
      );

      // Validate the document type ID
      await this.checkDocumentTypeIdValid(partnerDetails.documentTypeId);

      // upload the document front and back image on cloud
      const { documentFrontUrl, documentBackUrl } = await this.uploadFile(files);

      // create the partner with upload document urls and provided partner details.
      const newPartner = new Partner({
        documentFrontImage: documentFrontUrl,
        documentBackImage: documentBackUrl,
        ...partnerDetails,
      });
      newPartner.save();

      // return the newly created partner
      return newPartner;
    } catch (err) {
      throw new ApiError(500, 'Error occurred while create the partner', err);
    }
  }
}

// create an PartnerService instance and export it
export const partnerService = new PartnerService();
