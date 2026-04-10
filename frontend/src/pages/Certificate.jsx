import React from 'react';

const Certificate = () => {
    const certificates = [
        {
            title: "USMLE",
            description: "United States Medical Licensing Examination",
            image: "https://www.prometric.com/images/Client-logos/_max500/99630/USMLE_Vertical-Logo_FullColor_RGB_R.webp",
            link: "https://en.wikipedia.org/wiki/United_States_Medical_Licensing_Examination"
        },
        {
            title: "PLAB",
            description: "Professional and Linguistic Assessments Board",
            image: "https://media.licdn.com/dms/image/v2/D5612AQFFPq1KUsag2g/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1679478756399?e=2147483647&v=beta&t=VZGK47CyYClN4MhqsyJYi8dA8pGkdO38NhVaDk4s8Oo",
            link: "https://www.gmc-uk.org/registration-and-licensing/join-our-registers/plab"
        },
        {
            title: "MCCQE",
            description: "Medical Council of Canada Qualifying Examination",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY_8-c0TnEp1HhBwtb6tVHqzkRR9NMlIXBVA&s",
            link: "https://www.mcc.ca/"
        },
        {
            title: "AMC",
            description: "Australian Medical Council",
            image: "https://medbots.in/uploads/exams/exam_images/law_(33).jpg",
            link: "https://www.amc.org.au/"
        }
    ];

    return (
        <div style={libStyles.wrapper}>
            <div style={libStyles.container}>
                <h1 style={libStyles.pageTitle}>International Certificates</h1>
                <div style={libStyles.grid}>
                    {certificates.map((certificate, index) => (
                        <div key={index} style={libStyles.card}>
                            <div style={libStyles.imageBox}>
                                <img src={certificate.image} alt={certificate.title} style={libStyles.img} />
                            </div>
                            <div style={libStyles.content}>
                                <h3 style={libStyles.titleText}>{certificate.title}</h3>
                                <p style={libStyles.descText}>{certificate.description}</p>
                                <a href={certificate.link} className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors w-fit">
                                    Ro'yxatdan o'tish →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const libStyles = {
    wrapper: {
        backgroundColor: '#e8e8e8',
        minHeight: '100vh',
        padding: '2rem 1rem'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto'
    },
    pageTitle: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '2rem',
        borderBottom: '2px solid #d1d5db',
        paddingBottom: '1rem'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        maxWidth: '300px',
        margin: '0 auto'
    },
    imageBox: {
        height: '160px',
        backgroundColor: '#efcdff',
        width: '100%'
    },
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    content: {
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
    },
    titleText: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#111827',
        margin: '0 0 0.75rem 0',
        lineHeight: '1.4'
    },
    descText: {
        fontSize: '0.875rem',
        color: '#6b7280',
        lineHeight: '1.5',
        marginBottom: '1.5rem',
        flexGrow: 1
    }
};

export default Certificate;