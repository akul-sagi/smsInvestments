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
import { contactDetails } from '../data/siteContent';
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
      setMessage('Email is not configured for this deployment.');
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
    <SectionFrame id="contact" kicker="" title="Contact Us" prefersReducedMotion={prefersReducedMotion}>
      <div className="contact-layout">
        <div className="contact-info contact-info--desktop">
          <section aria-labelledby="contact-address-title">
            <h3 id="contact-address-title">Address</h3>
            <div className="address-grid">
              <p>{contactDetails.ukAddress.map((line) => <span key={line}>{line}</span>)}</p>
              <p>{contactDetails.indiaAddress.map((line) => <span key={line}>{line}</span>)}</p>
            </div>
          </section>

          <section aria-labelledby="contact-details-title">
            <h3 id="contact-details-title">Contact</h3>
            <p className="contact-links">
              <a href={`tel:${contactDetails.phone.replaceAll(' ', '')}`}>{contactDetails.phone}</a>
              <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
            </p>
          </section>

          <iframe
            className="contact-map"
            title="Map view of London office"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(contactDetails.ukMapQuery)}&z=15&output=embed`}
          />
        </div>

        <form className="contact-form" ref={formRef} onSubmit={handleSubmit} aria-busy={status === 'loading'}>
          <input type="hidden" name="to_email" value={contactToEmail} />
          <input type="hidden" name="subject" value="SMS Investments website enquiry" />
          <h3>Contact Form</h3>
          <label htmlFor="contact-name">
            Name
            <input id="contact-name" name="from_name" type="text" autoComplete="name" required />
          </label>
          <label htmlFor="contact-email">
            Email address
            <input id="contact-email" name="reply_to" type="email" autoComplete="email" required />
          </label>
          <label htmlFor="contact-message">
            Leave a message
            <textarea id="contact-message" name="message" rows={2} required />
          </label>
          <label className="file-input" htmlFor="contact-attachment">
            <span className="file-input-label">
              <Upload size={16} aria-hidden="true" />
              Upload file
            </span>
            <input
              id="contact-attachment"
              name="attachment"
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt,.rtf"
            />
          </label>
          <button className="primary-action submit-button" type="submit" disabled={status === 'loading'}>
            <Send size={16} aria-hidden="true" />
            {status === 'loading' ? 'Sending...' : 'Submit'}
          </button>
          <small>Never submit passwords.</small>
          {message ? (
            <p id="contact-form-status" className={`form-status ${status}`} role="status" aria-live="polite">
              {message}
            </p>
          ) : null}
        </form>

        <div className="contact-info contact-info--mobile">
          <section aria-labelledby="contact-uk-address-title">
            <h3 id="contact-uk-address-title">UK</h3>
            <p>{contactDetails.ukAddress.slice(1).map((line) => <span key={line}>{line}</span>)}</p>
          </section>

          <section aria-labelledby="contact-india-address-title">
            <h3 id="contact-india-address-title">India</h3>
            <p>{contactDetails.indiaAddress.slice(1).map((line) => <span key={line}>{line}</span>)}</p>
          </section>

          <section aria-labelledby="contact-details-title">
            <h3 id="contact-details-title">Contact</h3>
            <p className="contact-links">
              <a href={`tel:${contactDetails.phone.replaceAll(' ', '')}`}>{contactDetails.phone}</a>
              <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
            </p>
          </section>

          <section aria-labelledby="contact-map-title">
            <h3 id="contact-map-title">Map</h3>
            <a
              className="maps-action"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactDetails.ukMapQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in maps
            </a>
          </section>
        </div>
      </div>
    </SectionFrame>
  );
}
