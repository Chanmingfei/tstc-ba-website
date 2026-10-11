// HTTP 响应与 CORS 辅助
import { ALLOWED_ORIGINS } from './config.js';

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.join(', '),
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
  };
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(), ...headers },
  });
}

export function html(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders(), ...headers },
  });
}

export function redirect(location, status = 302) {
  return new Response(null, { status, headers: { Location: location } });
}

export function handleOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
