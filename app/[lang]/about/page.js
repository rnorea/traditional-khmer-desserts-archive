"use client";

import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar.js";
import Footer from "../../../components/Footer.js";
import { t } from "../../../data/translations.js";

export default function AboutPage() {
  const params = useParams();
  const language = params?.lang || 'en';
  const text = t[language] || t.en;

  return (
    <>
      <Navbar language={language} />
      
      <main className="container" style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: 'calc(100vh - 300px)' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: 'var(--green-primary)', 
          textAlign: 'center', 
          marginBottom: '3rem',
          fontFamily: 'var(--font-serif)'
        }}>
          {text.aboutTitle}
        </h1>

        <div style={{
          display: 'grid',
          gap: '2.5rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem 2.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            borderLeft: '4px solid var(--gold-accent)'
          }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>🎯</span> {text.ourMission}
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
              {text.missionText}
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem 2.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            borderLeft: '4px solid var(--green-primary)'
          }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>📖</span> {text.ourStory}
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
              {text.storyText}
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem 2.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            borderLeft: '4px solid var(--gold-accent)'
          }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>👋</span> {text.aboutMe}
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
              {text.aboutMeText}
            </p>
          </div>

        </div>
      </main>

      <Footer language={language} />
    </>
  );
}
