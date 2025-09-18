# Uploads Directory

This directory stores uploaded images for the Sweet Shop application.

## Structure

- `images/` - Contains all uploaded image files
  - Images are automatically saved with unique filenames to prevent conflicts
  - Supported formats: JPG, JPEG, PNG, GIF, WEBP
  - Maximum file size: 5MB per image

## Access

Images can be accessed via the API at:
- `GET /uploads/images/{filename}` - Direct access to specific image

## Security

- Only image files are allowed
- File size is limited to 5MB
- Filenames are sanitized and made unique to prevent conflicts