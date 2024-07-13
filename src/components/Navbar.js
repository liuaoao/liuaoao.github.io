import { Link } from 'react-router-dom'

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <h1>The liuaoao Blog</h1>
            <div className="links">
                {/* link的话不用refresh */}
                <Link to="/">Home</Link>
                {/* <Link to="/create" style={{
                    color: "white",
                    backgroundColor: "#f1356d",
                    borderRadius: "8px"
                }}>New Blog</Link> */}
            </div>
        </nav>
     );
}
 
export default Navbar;
