
const Mesh = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-repeat" style={{
            backgroundImage: `radial-gradient(circle at center, 
                rgba(0,0,0,0) 0%, 
                rgba(0,0,0,0.9) 150%),
                url("mesh.svg")`,
            backgroundSize: 'auto',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center'
        }}>
        </div>
    );
};

export default Mesh;