import React from 'react';

const Library = () => {
    const books = [
        {
            title: "Gray's Anatomy",
            description: "Inson anatomiyasi bo'yicha eng nufuzli darslik. Tibbiyot talabalari uchun asosiy manba.",
            image: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781667204734/grays-anatomy-9781667204734_hr.jpg",
            link: "https://books.google.co.uz/books?id=qlgAEAAAQBAJ&printsec=copyright&redir_esc=y#v=onepage&q&f=false"
        },
        {
            title: "Robbins Basic Pathology",
            description: "Kasalliklar patologiyasi va ularning kelib chiqish mexanizmlari haqida batafsil ma'lumot.",
            image: "https://m.media-amazon.com/images/I/61qF3kO1DfL._AC_UF1000,1000_QL80_.jpg",
            link: "https://books.google.co.in/books?id=jheBzf17C7YC&printsec=copyright#v=onepage&q&f=false"
        },
        {
            title: "Guyton and Hall Physiology",
            description: "Inson fiziologiyasi bo'yicha dunyodagi eng mashhur va ishonchli qo'llanma.",
            image: "https://secure-ecsd.elsevier.com/covers/80/Tango2/original/9780443111013.jpg",
            link: "https://books.google.co.uz/books?id=v981DwAAQBAJ&printsec=copyright&redir_esc=y#v=onepage&q&f=false"
        },
        {
            title: "How Doctors Think",
            description: "Doktorlar qanday fikrlaydi?",
            image: "https://m.media-amazon.com/images/I/81wXcP52kfL.jpg_BO30,255,255,255_UF750,750_SR1910,1000,0,C_QL100_.jpg",
            link: "https://books.google.co.uz/books/about/How_Doctors_Think.html?id=hoNQPgAACAAJ&redir_esc=y"
        }
    ];

    return (
        <div style={libStyles.wrapper}>
            <div style={libStyles.container}>
                <h1 style={libStyles.pageTitle}>Kutubxona</h1>
                <div style={libStyles.grid}>
                    {books.map((book, index) => (
                        <div key={index} style={libStyles.card}>
                            <div style={libStyles.imageBox}>
                                <img src={book.image} alt={book.title} style={libStyles.img} />
                            </div>
                            <div style={libStyles.content}>
                                <h3 style={libStyles.titleText}>{book.title}</h3>
                                <p style={libStyles.descText}>{book.description}</p>
                                <a href={book.link} className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors w-fit">
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

export default Library;