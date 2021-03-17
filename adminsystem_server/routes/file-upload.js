const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dirPath = path.join(__dirname, '..', 'public/uploads');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdir(dirPath, (err) => {
        if (err) {
          console.log(err);
        } else {
          callback(null, dirPath);
        }
      });
    } else {
      callback(null, dirPath);
    }
  },

  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    callback(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });
const uploadSingle = upload.single('image');

const fileUpload = (router) => {
  // request url: /manage/img/add
  // upload an image
  router.post('/manage/img/add', (req, res) => {
    uploadSingle(req, res, (error) => {
      if (error) {
        return res.send({ status: 1, msg: 'upload the image error' });
      }
      if (req.file === undefined) {
        return res.send({ status: 1, msg: 'no file selected' });
      }

      return res.send({ status: 0, data: { name: req.file.filename, url: `http://localhost:5000/uploads/${req.file.filename}` } });
    });
  });

  // request url: /manage/img/delete
  // delete an image
  router.post('/manage/img/delete', (req, res) => {
    const { name } = req.body;
    fs.unlink(path.join(dirPath, name), (error) => {
      if (error) {
        console.log(error);
        res.send({ status: 1, msg: 'delete the image error, please try again later' });
      } else {
        res.send({ status: 0, data: name });
      }
    });
  });
};

module.exports = fileUpload;
