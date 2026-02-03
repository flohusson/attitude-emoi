
const { ArticleSchema, EpisodeSchema } = require('./src/lib/schemas');
const { z } = require('zod');

console.log('Testing Schemas...');

try {
    const ep = EpisodeSchema.parse({
        title: 'Test Episode',
        slug: 'test-episode',
        date: new Date().toISOString(),
        audioUrl: 'https://example.com/audio.mp3',
        coverImage: '/images/test.jpg'
    });
    console.log('Episode parsed successfully:', ep);
} catch (e) {
    console.error('Episode parsing failed:', e);
}

console.log('Done.');
