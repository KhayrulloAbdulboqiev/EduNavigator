import React from 'react';

const BookCard = ({ title, image, description, readLink }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
            {/* Rasm qismi (Rasmdagi kabi yuqori qism) */}
            <div className="w-full h-52 bg-[#eed4ff] overflow-hidden flex-shrink-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover object-top"
                />
            </div>

            {/* Matn va tugma qismi */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Sarlavha */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug line-clamp-2">
                    {title}
                </h3>

                {/* Qisqa tavsif */}
                <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow">
                    {description}
                </p>

                {/* Tugma */}
                <a
                    href={readLink}
                    className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-md transition-colors w-max mt-auto"
                >
                    Batafsil o'qish
                    <svg
                        className="w-4 h-4 font-bold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default BookCard;