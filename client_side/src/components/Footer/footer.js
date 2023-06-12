import React from 'react'
import '../../styles/footer.css'
import camsBlue from '../../assets/camsBlue.png';

const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  return (
    <div className='footer'>
            
            <div className="footer-top-container">

                {/* logo goes here */}
                <div className='footer-logo'>
                    <div class="footer-camsBlue"> <img src={camsBlue} alt="CAMS Logo" />  </div>
                    <div class="footer-tag">Capstone-Projects Management System</div>
                </div>

                {/* Footer Links goes here */}
                 <div className='footer-links'>
                    <p className='footer-contact'>Contact Us</p>
                    <p className='footer-privacy'>Privacy & Terms</p>

                {/* Top to the page icon goes here */}
                 <div className='arrow' onClick={scrollToTop}> 
                        <svg className='qSvg' xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                              <g id="top" transform="translate(-1821 -920)">
                              <circle id="Ellipse_1" data-name="Ellipse 1" cx="18" cy="18" r="18" transform="translate(1821 920)" fill="#0097eb"/>
                              <path id="ic_arrow_upward_24px" d="M4,12.736l1.54,1.54,6.1-6.094v13.29h2.184V8.182l6.094,6.1,1.551-1.551L12.736,4Z" transform="translate(1826.264 925.264)" fill="#fff"/>
                             </g>
                        </svg>
                    </div>
                </div>

            </div>

            <div className="footer-bottom-container">

               <div className='left-text'>© 2023 Kenneth K. Fletcher - University of Massachusetts Boston</div>

               <div className='right-text'>M-3-201-21, Mc Cormack Building | Phone: 617.287.3832 | Email: kenneth.fletcher@umb.edu</div>


            </div>
    </div>
  )
}

export default Footer