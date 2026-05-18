import { FormEvent, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Send, Upload } from 'lucide-react';
import {
  contactToEmail,
  emailJsPublicKey,
  emailJsServiceId,
  emailJsTemplateId,
  isEmailJsConfigured,
} from '../config/email';
import { SectionFrame } from './SectionFrame';

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

type ContactSectionProps = {
  prefersReducedMotion: boolean;
};

export function ContactSection({ prefersReducedMotion }: ContactSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const configured = isEmailJsConfigured();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    if (!configured || !formRef.current) {
      setStatus('error');
      setMessage(
        'Email is not configured for this deployment. Set VITE_EMAILJS_* and VITE_CONTACT_TO_EMAIL, then rebuild.',
      );
      return;
    }

    const form = formRef.current;
    const fileInput = form.querySelector<HTMLInputElement>('input[name="attachment"]');
    const file = fileInput?.files?.[0];
    if (file && file.size > MAX_ATTACHMENT_BYTES) {
      setStatus('error');
      setMessage(`Attachments must be ${MAX_ATTACHMENT_BYTES / (1024 * 1024)} MB or smaller.`);
      return;
    }

    try {
      await emailjs.sendForm(emailJsServiceId, emailJsTemplateId, form, {
        publicKey: emailJsPublicKey,
      });
      form.reset();
      setStatus('success');
      setMessage('Your message has been sent.');
    } catch {
      setStatus('error');
      setMessage('The message could not be sent. Please try again later.');
    }
  };

  return (
    <SectionFrame
      id="contact"
      kicker=""
      title="Contact Us"
      prefersReducedMotion={prefersReducedMotion}
    >
      <div className="contact-layout">
        <form className="contact-form" ref={formRef} onSubmit={handleSubmit} aria-busy={status === 'loading'}>
          <input type="hidden" name="to_email" value={contactToEmail} />
          <label htmlFor="contact-first-name">
            First name
            <input id="contact-first-name" name="first_name" type="text" autoComplete="given-name" required />
          </label>
          <label htmlFor="contact-last-name">
            Last name
            <input id="contact-last-name" name="last_name" type="text" autoComplete="family-name" required />
          </label>
          <label htmlFor="contact-email">
            Email
            <input id="contact-email" name="reply_to" type="email" autoComplete="email" required />
          </label>
          <label htmlFor="contact-subject">
            Subject
            <input id="contact-subject" name="subject" type="text" required />
          </label>
          <label className="full" htmlFor="contact-message">
            Type your message here
            <textarea id="contact-message" name="message" rows={4} required />
          </label>
          <label className="file-input full" htmlFor="contact-attachment">
            <span className="file-input-label">
              <Upload size={18} aria-hidden="true" />
              Upload file
            </span>
            <input
              id="contact-attachment"
              name="attachment"
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt,.rtf"
            />
          </label>
          <button className="primary-action full submit-button" type="submit" disabled={status === 'loading'}>
            <Send size={18} aria-hidden="true" />
            {status === 'loading' ? 'Sending…' : 'Submit'}
          </button>
          {message ? (
            <p id="contact-form-status" className={`form-status ${status}`} role="status" aria-live="polite">
              {message}
            </p>
          ) : null}
        </form>

        <aside className="contact-qr-aside" aria-label="WhatsApp">
          <img
            src="/assets/qr-code.png"
            alt="QR code to join the SMS Investments WhatsApp group"
            width={200}
            height={200}
            loading="lazy"
            decoding="async"
          />
          <p>Scan to join our WhatsApp group.</p>
        </aside>
      </div>
    </SectionFrame>
  );
}
