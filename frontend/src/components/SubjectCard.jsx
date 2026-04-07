import React from 'react';
import { Play } from 'lucide-react';

const SubjectCard = ({ title, image, videoLink = '#' }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 flex flex-col group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12" />
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {title}
                </h3>

                <div className="mt-auto">
                    <a
                        href={videoLink}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                    >
                        <Play size={18} />
                        Watch Video
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SubjectCard;
