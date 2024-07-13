const articles = [
    {
    name: 'category1',
    type: 'directory',
    children: [
    { name: 'article1.md', type: 'file' },
    { name: 'article2.md', type: 'file' },
    ],
    },
    {
    name: 'category2',
    type: 'directory',
    children: [
    {
    name: 'subcategory1',
    type: 'directory',
    children: [
    { name: 'article3.md', type: 'file' },
    { name: 'article4.md', type: 'file' },
    ],
    },
    { name: 'article5.md', type: 'file' },
    ],
    },
    ];
    
    export default articles;