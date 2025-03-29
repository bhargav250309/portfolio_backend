
import fs from 'fs';
const deleteFileIfExists = (filePath) => {
    return new Promise((resolve, reject) => {
      if (filePath) {
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                return reject(
                  new Error(
                    `Failed to delete file: ${filePath}, Error: ${unlinkErr.message}`
                  )
                );
              }
              resolve(); // Successfully deleted
            });
          } else {
            resolve(); // Resolve if the file does not exist
          }
        });
      } else {
        resolve(); // Resolve if no file path is provided
      }
    });
  };
  export default deleteFileIfExists;