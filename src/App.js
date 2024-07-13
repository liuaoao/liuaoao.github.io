import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './Home';
import Article from './components/Article';
import './App.css'; // 引入CSS文件
import NotFound from './components/NotFound';

const App = () => {
    return (
        <Router>
            <div>
                <Navbar />
                <div className="container">
                    <Sidebar />
                    <main className="main">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/articles/*" element={<Article />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
};

export default App;