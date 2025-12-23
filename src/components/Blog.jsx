
import React from 'react';
import blogData from '../data/blog.json';

const Blog = () => {
    return (
        <section className="section" id="blog" style={{ padding: '1rem 0' }}>
            <div className="section-header">
                <h3>Technical Writing</h3>
            </div>

            <div>
                {blogData.map((post) => (
                    <article key={post.id} className="card" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h4 style={{ fontSize: '1.2rem' }}>
                                <a href={post.url}>{post.title}</a>
                            </h4>
                            <span style={{ fontSize: '0.9rem', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>{post.date}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>{post.summary}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Blog;
