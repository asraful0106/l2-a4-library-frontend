const Footer = () => {
    return (
        <>
            <footer className="bg-white">
                <div className="w-full mx-auto max-w-screen p-4 flex items-center justify-center">
                    <span className="text-sm text-gray-500 sm:text-center ">
                        © 2023{" "}
                        <a href="#" className="hover:underline">
                            Favorite Book™
                        </a>
                        . All Rights Reserved.
                    </span>
                </div>
            </footer>
        </>
    );
};

export default Footer;