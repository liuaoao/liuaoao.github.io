const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'src', 'articles');

const generateArticlesTree = (dir, relativePath = '') => {
    const files = fs.readdirSync(dir);

    return files.map((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        const fileRelativePath = path.join(relativePath, file);

        if (stat.isDirectory()) {
            return {
                name: file,
                type: 'directory',
                children: generateArticlesTree(filePath, fileRelativePath),
            };
        } else if (file.endsWith('.md')) {
            return {
                name: file,
                type: 'file',
                path: fileRelativePath.replace(/\\/g, '/'),
            };
        }
        return null;
    }).filter(Boolean);
};

const articlesTree = generateArticlesTree(articlesDir);
const outputPath = path.join(__dirname, 'src', 'articles', 'index.json');

fs.writeFileSync(outputPath, JSON.stringify(articlesTree, null, 2), 'utf-8');
console.log('Articles JSON file generated successfully.');