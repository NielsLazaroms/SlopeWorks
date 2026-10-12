import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ValidatorFn} from '@angular/forms';
import {MnLanguageService} from 'mn-angular-lib/core';
import type {Firestore} from 'firebase/firestore/lite';
import {firebaseConfig} from '../../environments/firebase.config';

/**
 * Email format accepted by `firestore.rules` (`email()` there). Forms validate
 * with the same pattern so the rules never reject an address the form allowed.
 */
export const SUBMISSION_EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Validator that rejects empty or whitespace-only text, as the rules do after trimming. */
export const notBlank: ValidatorFn = control =>
  typeof control.value === 'string' && control.value.trim() ? null : {required: true};

/** A message sent through the contact form. */
export interface ContactSubmission {
  /** Visitor's name. */
  name: string;
  /** Address to reply to. */
  email: string;
  /** Short subject line. */
  subject: string;
  /** Message body. */
  message: string;
}

/**
 * A Ski Trip Scan whose result the visitor asked to receive by email: their
 * details plus the full scan in readable form (names and answer texts in the
 * visitor's language), so it can be read and mailed straight from the console.
 */
export interface QuizSubmission {
  /** Visitor's first name. */
  firstName: string;
  /** Address to send the result to. */
  email: string;
  /** Company name; omitted when left empty. */
  company?: string;
  /** Whether the visitor opted in to occasional inspiration emails. */
  newsletter: boolean;
  /** Name of the best match, e.g. "Kitzbühel-Kirchberg". */
  match: string;
  /** Name of the alternative. */
  alternative: string;
  /** Trip style name, e.g. "Reset". */
  tripStyle: string;
  /** The budget answer as the visitor saw it. */
  budget: string;
  /** The group-size answer, e.g. "26–35 personen". */
  groupSize: string;
  /** Whether a budget note was shown on the result. */
  budgetNote: boolean;
  /** Numbered short question label → answer text, e.g. "1 Ideale skidag" → "…". */
  answers: Record<string, string>;
  /** Character score per destination name. */
  scores: Record<string, number>;
}

/**
 * Stores form submissions in Firestore.
 *
 * The Firebase SDK is imported dynamically on the first submit, so it never
 * ends up in the main bundle or in the prerendered HTML. Documents are
 * create-only; the matching validation lives in `firestore.rules`.
 */
@Injectable({providedIn: 'root'})
export class SubmissionService {

  /** Used to skip Firestore during prerendering. */
  private readonly platformId = inject(PLATFORM_ID);

  /** Source of the visitor's current locale, stored with each submission. */
  private readonly language = inject(MnLanguageService);

  /** Lazily created Firestore instance, shared across submissions. */
  private firestore?: Promise<Firestore>;

  /**
   * Saves a contact-form message to the `contactMessages` collection.
   *
   * @param submission The validated form values.
   */
  async submitContact(submission: ContactSubmission): Promise<void> {
    await this.add('contactMessages', submission.subject, {...submission});
  }

  /**
   * Saves a Ski Trip Scan with the visitor's details to the `quizSubscribers`
   * collection, named after the match and first name. An empty company is left
   * out, because the rules only accept non-empty text.
   *
   * @param submission The visitor's details and scan result.
   */
  async subscribeQuiz(submission: QuizSubmission): Promise<void> {
    const {company, ...rest} = submission;
    await this.add('quizSubscribers', `${submission.match} ${submission.firstName}`, company ? {...rest, company} : rest);
  }

  /**
   * Creates a document with the shared metadata (`locale`, `domain`,
   * server-side `createdAt`) under a readable id (see {@link documentId}).
   *
   * @param collectionName Target Firestore collection.
   * @param label Text that names the document, e.g. the message subject.
   * @param data Form-specific fields.
   */
  private async add(collectionName: string, label: string, data: Record<string, unknown>): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Submissions can only be sent from the browser.');
    }
    const {doc, setDoc, serverTimestamp} = await import('firebase/firestore/lite');
    const db = await this.getFirestore();
    await setDoc(doc(db, collectionName, this.documentId(label)), {
      ...data,
      locale: this.language.locale,
      domain: window.location.hostname,
      createdAt: serverTimestamp(),
    });
  }

  /**
   * Builds a readable document id such as `2026-10-12_1823_ski-retreat-februari_3f9a`:
   * Brussels date and time (so the console lists entries chronologically), a
   * slug of `label`, and a random suffix so two entries never collide. The
   * rules only allow creates, so a collision could never overwrite an entry.
   *
   * @param label Text to slugify into the id.
   */
  private documentId(label: string): string {
    const stamp = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Europe/Brussels',
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    }).format(new Date()).replace(' ', '_').replace(':', '');
    const slug = label.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'anonymous';
    return `${stamp}_${slug}_${crypto.randomUUID().slice(0, 4)}`;
  }

  /**
   * Initializes the Firebase app and Firestore once, on first use. A failed
   * load (e.g. the visitor is offline) is not cached, so a retry can succeed.
   */
  private getFirestore(): Promise<Firestore> {
    this.firestore ??= Promise.all([import('firebase/app'), import('firebase/firestore/lite')])
      .then(([{initializeApp, getApps}, {getFirestore}]) =>
        getFirestore(getApps()[0] ?? initializeApp(firebaseConfig)))
      .catch((error: unknown) => {
        this.firestore = undefined;
        throw error;
      });
    return this.firestore;
  }
}
