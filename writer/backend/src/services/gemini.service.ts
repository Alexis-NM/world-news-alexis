import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import dotenv from "dotenv";
import { ValidationError } from "../errors/validation.error.js";

dotenv.config();

class GeminiService {
  private model: GenerativeModel;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY manquante dans le .env");

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash-lite" }
    );
  }

  async generateTitle(body: string): Promise<string> {
    if (!body || body.trim().length < 50) {
      throw new ValidationError("Le contenu de l'article est trop court pour générer un titre");
    }

    const prompt = `Tu es un journaliste professionnel. Rédige un titre pour l'article suivant. 
    Le ton doit être journalistique. Ne rajoute aucune phrase d'introduction, d'explication ou de commentaire. Ne mets que le texte du titre, directement.

    Contenu de l'article :
    ${body}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("L'IA n'a pas pu générer de texte");
    }

    return text.trim();
  }

  async generateSubtitle(title: string, body: string): Promise<string> {
    if (!body || body.trim().length < 50) {
      throw new ValidationError("Le contenu de l'article est trop court pour générer un sous-titre");
    }

    const prompt = `Tu es un journaliste professionnel. Rédige un sous-titre de 1 à 2 phrases pour l'article suivant. 
    Le ton doit être journalistique. Ne rajoute aucune phrase d'introduction, d'explication ou de commentaire. Ne mets que le texte du sous-titre, directement.
    
    Titre de l'article :
    ${title}
    
    Contenu de l'article :
    ${body}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("L'IA n'a pas pu générer de texte");
    }

    return text.trim();
  }

  async generateSubhead(body: string): Promise<string> {
    if (!body || body.trim().length < 50) {
      throw new ValidationError("Le contenu de l'article est trop court pour générer un chapeau (min 50 caractères)");
    }

    const prompt = `Tu es un rédacteur en chef professionnel. Rédige un "chapeau" (résumé accrocheur) de 2 à 3 phrases pour l'article suivant. 
    Le ton doit être journalistique. Ne rajoute aucune phrase d'introduction, d'explication ou de commentaire. Ne mets que le texte du chapeau, directement.
    Termine par une phrase d'ouverture vers l'article.

    CONTENU DE L'ARTICLE :
    ${body}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("L'IA n'a pas pu générer de texte");
    }

    return text.trim();
  }
  
  async generateBody(body: string): Promise<string> {
    if (!body || body.trim().length < 50) {
      throw new ValidationError("Le contenu de l'article est trop court pour générer un chapeau (min 50 caractères)");
    }

    const prompt = `Tu es un rédacteur en chef professionnel. Ta mission : corriger et reformuler le texte de l'article ci-dessous pour améliorer la clarté, la fluidité et la lisibilité. 
    - Corrige les fautes d’orthographe et de grammaire.
    - Reformule les phrases pour qu’elles soient plus naturelles et percutantes.
    - Respecte le ton journalistique.
    - Ne change pas le sens des informations.
    - Ne rajoute aucune introduction, information, conclusion ou commentaire.

    CONTENU DE L'ARTICLE :
    ${body}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("L'IA n'a pas pu générer de texte");
    }

    return text.trim();
  }
}

export const geminiService = new GeminiService();
