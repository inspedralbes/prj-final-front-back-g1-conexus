const express = require('express');
const cors = require('cors');
const fs = require('fs');

const path = require('path');
const dotenv = require('dotenv');

function loadEnv(envPath) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
      throw result.error;
  }
  return result.parsed; 
}

const statEnd = loadEnv(path.resolve(__dirname, './.env'));
const app = express();
const port = statEnd.PORT;

app.use(express.json());
app.use(cors({
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type", "Authorization"],
}));

app.get('/', (req, res) => {
    res.send('Hello World! XDDDDDDDDDDDDDDD I am a stadistics service');
});

app.use('/upload/comments', express.static(path.join(__dirname, 'python/images/statistics/comments')));
app.use('/upload/publications', express.static(path.join(__dirname, 'python/images/statistics/publications')));
app.use('/upload/users', express.static(path.join(__dirname, 'python/images/statistics/users')));

app.get('/images', (req, res) => {
    const commentsDir = path.join(__dirname, 'python/images/statistics/comments');
    const publicationsDir = path.join(__dirname, 'python/images/statistics/publications');
    const usersDir = path.join(__dirname, 'python/images/statistics/users');

    const getImages = (dir, parentFolder = '') => {
        try {
            if (!fs.existsSync(dir)) {
                console.error(`Directory ${dir} does not exist.`);
                return {};
            }

            const files = fs.readdirSync(dir).filter(file => {
                const fullPath = path.join(dir, file);
                return fs.statSync(fullPath).isFile();
            });

            return {
                folder: path.basename(dir),
                images: files.map(file => path.join('/upload', parentFolder, path.basename(dir), file).replace(/\\/g, '/'))
            };
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
            return {};
        }
    };

    const getSubfoldersImages = (dir, parentFolder = '') => {
        try {
            if (!fs.existsSync(dir)) {
                console.error(`Directory ${dir} does not exist.`);
                return {};
            }

            const subfolders = fs.readdirSync(dir).filter(subfolder => {
                const fullPath = path.join(dir, subfolder);
                return fs.statSync(fullPath).isDirectory();
            });

            const result = {};
            subfolders.forEach(subfolder => {
                const subfolderPath = path.join(dir, subfolder);
                result[subfolder] = getImages(subfolderPath, parentFolder);
            });

            return result;
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
            return {};
        }
    };

    const images = {
        comments: getSubfoldersImages(commentsDir, 'comments'),
        publications: getSubfoldersImages(publicationsDir, 'publications'),
        users: getSubfoldersImages(usersDir, 'users')
    };

    console.log('Images:', images);

    res.json(images);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});