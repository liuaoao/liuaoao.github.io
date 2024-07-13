import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import articles from '../getArticles';

const DirectoryTree = () => {
    const [openNodes, setOpenNodes] = useState({});

    const toggleNode = (path) => {
        setOpenNodes({ ...openNodes, [path]: !openNodes[path] });
    };
    const processName = (name) => {
        const parts = name.split(' ');
        if (parts.length > 1) {
            parts.pop();
        }
        return parts.join(' ');
    };

    const renderNodes = (nodes, basePath = '') => {
        return nodes.map((node) => {
            const processedName = processName(node.name); // 处理名称
            const fullPath = `${basePath}/${node.name}`;
            const displayName = processedName.replace(/\.md$/, ''); // 移除.md后缀
            if (node.type === 'directory') {
                // 检查目录中是否有相同名称的.md文件
                const matchingMdFile = node.children.find(child => child.type === 'file' && child.name === `${node.name}.md`);
                const isOpen = openNodes[fullPath];
                return (
                    <div key={fullPath}>
                        <div onClick={() => toggleNode(fullPath)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <span style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                ▸
                            </span>
                            <Link to={`/articles${processName(fullPath)}.md`} style={{ marginLeft: '8px' }}>
                                {displayName}
                            </Link>
                        </div>
                        {isOpen && (
                            <div style={{ paddingLeft: '20px' }}>
                                {renderNodes(node.children.filter(child => child !== matchingMdFile), fullPath)}
                            </div>
                        )}
                    </div>
                );
            }

            // 仅当同目录下没有同名目录时显示
            const hasMatchingDirectory = nodes.some(sibling => sibling.type === 'directory' && processName(sibling.name) === displayName);
            return !hasMatchingDirectory ? (
                <div key={fullPath}>
                    <Link to={`/articles${basePath}/${node.name}`} title={displayName}>
                        {displayName}
                    </Link>
                </div>
            ) : null;
        });
    };

    return <div className="sidebar">{renderNodes(articles)}</div>;
};

export default DirectoryTree;