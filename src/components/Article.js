import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Article = () => {
    const location = useLocation();
    const [markdownContent, setMarkdownContent] = useState('');

    useEffect(() => {
        const decodedPath = decodeURIComponent(location.pathname.replace('/articles', ''));
        if (decodedPath) {
            const articlePath = decodedPath.endsWith('.md') ? decodedPath : `${decodedPath}/${decodedPath.split('/').pop()}.md`;
            console.log('Loading article from path:', articlePath);
            import(`../articles${articlePath}`)
                .then((res) => fetch(res.default))
                .then((res) => res.text())
                .then((text) => setMarkdownContent(text))
                .catch((err) => console.error('Error loading article:', err));
        }
    }, [location.pathname]);

    const renderers = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter style={darcula} language={match[1]} PreTag="div" {...props}>
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
        img: ({ src, alt }) => {
            try {
                const decodedPath = decodeURIComponent(location.pathname.replace('/articles', ''));
                console.log(decodedPath)
                const imagePath = require(`../articles${decodedPath.substring(0, decodedPath.lastIndexOf('/'))}/${decodeURIComponent(src)}`);
                console.log(imagePath)
                return (
                    <zoom>< img src={imagePath} alt={alt} className="markdown-img" />;
                    </zoom>)
            } catch (err) {
                console.error('Error loading image:', err)
                return <span>{`![${alt}](${src})`}</span>
            }
        },
    };

    return (
        <div className="article-content">
            <ReactMarkdown components={renderers}>{markdownContent}</ReactMarkdown>
        </div>
    );
};

export default Article;