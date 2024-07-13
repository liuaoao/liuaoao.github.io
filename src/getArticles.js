const requireContext = require.context('./articles', true, /\.md$/);

const generateArticlesTree = (context) => {
    const tree = [];

    context.keys().forEach((key) => {
        const parts = key.split('/').slice(1); // 去掉开头的 "."
        let currentLevel = tree;

        parts.forEach((part, index) => {
            const existingPath = currentLevel.find(
                (item) => item.name === part && item.type === (index === parts.length - 1 ? 'file' : 'directory')
            );

            if (existingPath) {
                currentLevel = existingPath.children;
            } else {
                const newPath = {
                    name: part,
                    type: index === parts.length - 1 ? 'file' : 'directory',
                    path: index === parts.length - 1 ? key : undefined,
                    children: index === parts.length - 1 ? undefined : [],
                };
                currentLevel.push(newPath);
                if (newPath.children) {
                    currentLevel = newPath.children;
                }
            }
        });
    });

    return tree;
};

const articles = generateArticlesTree(requireContext);

export default articles;