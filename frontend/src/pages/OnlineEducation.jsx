import React from 'react';

const OnlineEducation = () => {
    const videos = [
        {
            title: "Farmakologiya",
            description: "Farmakologiya bo'yicha darslik.",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/People%27s_health_and_wellness_with_drugs%28medicine%29.jpg",
            link: "https://youtu.be/V4u51-iUXHY?si=IB_7KZ8XHDejMjJ7"
        },
        {
            title: "Gistologiya",
            description: "Gistologiya bo'yicha darslik.",
            image: "https://medcollege.ru/wp-content/uploads/2021/05/%D0%B3%D0%B8%D1%81%D1%82%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F.jpg",
            link: "https://youtube.com/playlist?list=PLHRYW044xGMjTtmWi7mZEVjfN6jpGBBkx&si=JEKaW-JPHNPnk7F6"
        },
        {
            title: "Anatomiya",
            description: "Anatomiya bo'yicha darslik.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTV2iBABtP_NAc26ryfmTSOrTtVagBs_jv5w&s",
            link: "https://youtu.be/62Gifsz1B1U?si=neOGnNk-lrbLCJVI"
        }
    ];

    return (
        <div style={libStyles.wrapper}>
            <div style={libStyles.container}>
                <h1 style={libStyles.pageTitle}>Online Education</h1>
                <div style={libStyles.grid}>
                    {videos.map((video, index) => (
                        <div key={index} style={libStyles.card}>
                            <div style={libStyles.imageBox}>
                                <img src={video.image} alt={video.title} style={libStyles.img} />
                            </div>
                            <div style={libStyles.content}>
                                <h3 style={libStyles.titleText}>{video.title}</h3>
                                <p style={libStyles.descText}>{video.description}</p>
                                <a href={video.link} className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors w-fit">
                                    Find out more →
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

export default OnlineEducation;