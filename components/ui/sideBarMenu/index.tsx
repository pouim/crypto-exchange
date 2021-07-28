import React, { useState } from 'react';
import Link from 'next/link';

// import Icon from 'assets/svg/helpiaya.svg';
// import menu from 'assets/svg/menu.svg';

// import BackDrop from 'components/BackDrop';

import styles from './styles.module.css';

function index() {
    const [open, setOpen] = useState({ bool: false, className: '' });

    const items = [
        { title: 'کمپین ها', href: '#', click: () => onClose() },
        { title: 'خیریه ها', href: '#', click: () => onClose() },
        { title: 'داستان های موفق', href: '#', click: () => onClose() },
        { title: 'هلپیا چگونه کار میکند', href: '#', click: () => onClose() },
        { title: 'تماس با ما', href: '#', click: () => onClose() },
    ];

    const onOpen = () => {
        setOpen({ bool: true, className: styles.open });
    };

    const onClose = () => {
        setOpen({ bool: false, className: '' });
    };

    return (
        <>
            {/* {open.bool && <BackDrop click={onClose} />} */}
            <div className={`${styles.sidenav} ${open.className}`}>
                <div className="divide-y-2 divide-gray-400">
                    <div className="py-5 flex justify-center">
                        BRAND{/* <img src={Icon} alt="icon" /> */}
                    </div>
                    {items.map((i) => (
                        <React.Fragment key={i.title}>
                            <Link href={i.href}>
                                <span
                                    className="block text-14 py-5 cursor-pointer"
                                    onClick={i.click}
                                >
                                    <span className="mr-5">{i.title}</span>
                                </span>
                            </Link>
                        </React.Fragment>
                    ))}
                    <div className="flex w-full justify-center">
                        <button className="btn-green hover:opacity-75 px-3">کمپین میسازم</button>
                    </div>
                </div>
            </div>
            {/* <img src={menu} className="ml-5 cursor-pointer" onClick={onOpen} /> */}
        </>
    );
}

export default index;
