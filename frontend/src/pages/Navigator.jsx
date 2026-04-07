import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Info, Phone, Globe } from 'lucide-react';

const Navigator = () => {

    const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3177.1733934581707!2d67.28268427532306!3d37.2198585439322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f352d4b95dd8c4f%3A0x3b03c0969c3acc06!2sToshkent%20tibbiyot%20akademiyasi%20Termiz%20filiali!5e0!3m2!1sru!2s!4v1775527059405!5m2!1sru!2s";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.container}
        >
            <h2 style={styles.pageTitle}>Navigator (Edu-Map)</h2>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <Info size={24} color="var(--primary-color)" />
                    <h3 style={styles.sectionTitle}>Universitet haqida</h3>
                </div>
                <div style={styles.contentLayout}>
                    <div style={styles.imageWrapper}>
                        <img 
                            src="https://avatars.mds.yandex.net/get-altay/15081387/2a00000195511df663556698876475c8b195/orig"
                            alt="University"
                            style={styles.univImage}
                        />
                    </div>
                    <div style={styles.description}>
                        <p>Bizning universitet zamonaviy ta'lim standartlari va innovatsion texnologiyalarni birlashtirgan o'quv maskanidir. Biz talabalarga nafaqat nazariy bilim, balki amaliy ko'nikmalar berishni ham maqsad qilganmiz.</p>
                        <div style={styles.contactInfo}>
                            <div style={styles.infoItem}><Phone size={18} /> +998 (71) 123-45-67</div>
                            <div style={styles.infoItem}><Globe size={18} /> www.edunavigator.uz</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lokatsiya (Manzil) section */}
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <MapPin size={24} color="#ef4444" />
                    <h3 style={styles.sectionTitle}>Bizning manzilimiz</h3>
                </div>
                <div style={styles.mapContainer}>
                    <iframe
                        src={mapSrc}
                        style={styles.mapFrame}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="University Location"
                    ></iframe>
                    <div style={styles.locationDetail}>
                        <strong>Manzil:</strong> Termiz shahar, Mirzayeva ko'chasi
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

export default Navigator;