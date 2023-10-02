import React from 'react';
import '../../styles/Footer.css'

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>© 2023 My Company Name. All rights reserved.</p>
                <div className="contact-info">
                    <p><strong>Address:</strong> FPT University, Ha Noi, Vietnam</p>
                    <p><strong>Email:</strong> se_group_6@fpt.edu.vn</p>
                    <p><strong>Phone:</strong> +1 (123) 456-7890</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;