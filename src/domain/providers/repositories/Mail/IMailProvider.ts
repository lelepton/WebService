import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Mail } from '../../externals/Mail';

export interface IMailProvider {
    sendMail(mail: Mail): Promise<SMTPTransport.SentMessageInfo>;
}