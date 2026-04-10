import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Info, Phone, Globe } from 'lucide-react';

const Directors = () => {

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.container}
        >
            <h2 style={styles.pageTitle}>Rahbariyat (Directors)</h2>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <Info size={24} color="var(--primary-color)" />
                    <h3 style={styles.sectionTitle}>Rahbariyat haqida</h3>
                </div>
                <div style={styles.contentLayout}>
                    <div style={styles.imageWrapper}>
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_NJjw1_KHzxlRRwCdzCArHCPyzDKYQiY-3A&s"
                            alt="Dekan"
                            style={styles.univImage}
                        />
                    </div>
                    <div style={styles.description}>
                        <p>Sagirayev Nodir Jumaqulovich dekan lavozimida faoliyat yuritayotgan rahbar sifatida fakultetning o‘quv-uslubiy ishlarini muvofiqlashtirish, talabalar intizomini nazorat qilish va ta’lim sifatini oshirishga mas’ul shaxs hisoblanadi. U o‘z ish faoliyatida professor-o‘qituvchilar jamoasini birlashtirish, zamonaviy axborot texnologiyalarini o‘quv jarayoniga tatbiq etish va iqtidorli yoshlarni qo‘llab-quvvatlashga alohida e’tibor qaratadi. Shuningdek, dekan sifatida muassasaning ichki tartib-qoidalari ijrosini ta’minlash hamda kafedralararo ilmiy hamkorlikni rivojlantirish yo‘nalishida tizimli ishlarni amalga oshirib kelmoqda</p>
                        <div style={styles.contactInfo}>
                            <div style={styles.infoItem}><Phone size={18} /> +998 (90) 316-22-23</div>
                            <div style={styles.infoItem}><Globe size={18} /> nodirsagirayev@gmail.ru</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    },
    pageTitle: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: 'var(--text-dark)',
        marginBottom: '0.5rem'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid var(--border-color)'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '1rem'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: 'var(--text-dark)'
    },
    contentLayout: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'start'
    },
    imageWrapper: {
        borderRadius: '12px',
        overflow: 'hidden',
        height: '250px'
    },
    univImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    description: {
        color: '#475569',
        lineHeight: '1.6',
        fontSize: '1.05rem'
    },
    contactInfo: {
        marginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: 'var(--primary-color)',
        fontWeight: '500'
    },
    mapContainer: {
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
    },
    mapFrame: {
        width: '100%',
        height: '400px',
        border: 'none'
    },
    locationDetail: {
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid var(--border-color)',
        color: '#64748b'
    },
    '@media (max-width: 768px)': {
        contentLayout: {
            gridTemplateColumns: '1fr'
        }
    }
};

export default Directors;