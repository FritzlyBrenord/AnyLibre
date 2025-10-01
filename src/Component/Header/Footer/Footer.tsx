"use client";
import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="text-3xl font-bold mb-4">
                <span className="text-green-400">Any</span>
                <span className="text-white">libre</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                La plateforme freelance de référence pour connecter talents et
                projets exceptionnels.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-blue-400">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-blue-400">in</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-blue-400">@</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Catégories</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Développement Web
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Design & Créatif
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Marketing Digital
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Rédaction
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Consultation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">À propos</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Notre histoire
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carrières
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Presse
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Partenaires
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Investisseurs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Confiance & Sécurité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Qualité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Guide
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Communauté</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Forum
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Événements
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Podcast
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Affiliés
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2025 Anylibre. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Confidentialité
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Conditions
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
