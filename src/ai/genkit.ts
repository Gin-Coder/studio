import {genkit} from '@genkit-ai/core';
import {googleAI} from '@genkit-ai/google-genai';

// Genkit 1.x does not use configureGenkit. Config is passed directly to genkit()
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
