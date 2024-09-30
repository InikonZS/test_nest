import React from 'react';
import './footer.css';
import './logo.css';

export function Footer() {
    return <div className='pg_footer'>
        <div className='pg_footer_left'>
            <div className='pg_footer_hire_block'>
                <div className='pg_footer_section_title pg_footer_hire_title'>
                    Hire me
                </div>
                <div className='pg_footer_hire_text'>
                    Sometime i'm available for a new job, if you are HR and interested my skills for a job position, please contact me at linkedin.
                </div>
                <div className='pg_footer_hire_list'>
                    My CV:
                </div>
            </div>
            <div className='pg_footer_contacts_block'>
                <div className='pg_footer_section_title pg_footer_contacts_title'>
                    Contacts:
                </div>
                <div className='pg_footer_contacts_list'>
                    <div className='pg_footer_contact'>
                        <div className='pg_footer_contact_logo ico_github'>
                        </div>
                        <div className='pg_footer_contact_link'>
                            InikonZS
                        </div>
                    </div>
                    <div className='pg_footer_contact'>
                        <div className='pg_footer_contact_logo ico_linkedin'>
                        </div>
                        <div className='pg_footer_contact_link'>
                            Zhan Zhurydau
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='pg_footer_corner'>
            <div className="pg_corp_block">
                <div className="pg_corp_link">
                    <div className="pg_demo_a">
                        <span className="pg_demo_s">De</span>mo</div>by Inikon
                </div>
                <div className="pg_corp_site">
                    demo.inikon.online
                </div>
            </div>
        </div>

    </div>
}