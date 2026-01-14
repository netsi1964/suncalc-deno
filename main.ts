/**
 * Deno HTTP server for Sun & Moon Info app
 * 
 * Simple static file server that serves HTML, JS, CSS, and JSON files.
 * No build step required - serves vanilla JavaScript directly.
 * 
 * Usage: deno run --allow-net --allow-read main.ts
 * Access: http://localhost:8000/
 */

const PORT = 8000;

/**
 * Request handler for static file serving
 * 
 * @param req - Incoming HTTP request
 * @returns Response with file content or 404 error
 * 
 * Supported file types:
 * - .html → text/html
 * - .js → application/javascript
 * - .css → text/css
 * - .json → application/json
 */
const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  let filepath = url.pathname;

  // Default to index.html for root path
  if (filepath === '/') {
    filepath = '/index.html';
  }

  try {
    // Read file from disk (relative to current directory)
    const file = await Deno.readFile(`.${filepath}`);
    
    // Determine content type based on file extension
    let contentType = 'text/plain';
    if (filepath.endsWith('.html')) {
      contentType = 'text/html';
    } else if (filepath.endsWith('.js')) {
      contentType = 'application/javascript';
    } else if (filepath.endsWith('.css')) {
      contentType = 'text/css';
    } else if (filepath.endsWith('.json')) {
      contentType = 'application/json';
    }

    return new Response(file, {
      headers: {
        'content-type': contentType,
      },
    });
  } catch (_error) {
    // File not found or error reading file
    return new Response('404 Not Found', { status: 404 });
  }
};

console.log(`🌞 Sun & Moon Info server running at http://localhost:${PORT}/`);
Deno.serve({ port: PORT }, handler);
