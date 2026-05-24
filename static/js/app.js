/* ==========================================================================
   SITE DE CASAMENTO - VITOR & RAYANE
   JavaScript Interativo: RSVP, Countdown, Pix QR Code, Player e Lightbox
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    initCountdown();
    initScrollReveal();
    initRSVPForm();
    initMusicPlayer();
    initLightbox();
});

/* ==========================================================================
   1. TRANSICAO DO HEADER STICKY (GLASSMORPHISM)
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Dispara no carregamento inicial também caso a página já inicie rolada
    handleScroll();
    window.addEventListener('scroll', handleScroll);
}

/* ==========================================================================
   2. MENU MOBILE TOGGLE
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (!toggleBtn || !navMenu) return;
    
    const toggleMenu = () => {
        const isOpen = navMenu.classList.contains('open');
        navMenu.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', !isOpen);
    };
    
    toggleBtn.addEventListener('click', toggleMenu);
    
    // Fecha o menu ao clicar em qualquer link (âncora)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
}

/* ==========================================================================
   3. CONTADOR REGRESSIVO (COUNTDOWN)
   ========================================================================== */
function initCountdown() {
    // Alvo: 15 de Agosto de 2026 às 16:00:00 (Fuso GMT-03:00 - Horário de Unaí / Brasília)
    const targetDate = new Date("2026-08-15T16:00:00-03:00").getTime();
    
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;
        
        if (difference < 0) {
            // Chegou o grande dia!
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   4. ANIMAÇÕES DE ROlAGEM (SCROLL REVEAL)
   ========================================================================== */
function initScrollReveal() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Para rodar a animação apenas uma vez
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. PLAYER DE MÚSICA DE FUNDO
   ========================================================================== */
function initMusicPlayer() {
    const musicPlayer = document.getElementById('music-player');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    
    if (!musicPlayer || !bgMusic || !musicToggle) return;
    
    let isPlaying = false;
    
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicPlayer.classList.remove('playing');
        } else {
            bgMusic.play().catch(error => {
                console.log("Autoplay bloqueado pelo navegador. O usuário precisa interagir primeiro.", error);
            });
            musicPlayer.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}

/* ==========================================================================
   6. RSVP FORMULÁRIO DE CONFIRMAÇÃO (WHATSAPP)
   ========================================================================== */
function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    const statusSelect = document.getElementById('rsvp-status');
    const guestsWrapper = document.getElementById('rsvp-guests-wrapper');
    const guestsInput = document.getElementById('rsvp-guests');
    const namesWrapper = document.getElementById('rsvp-names-wrapper');
    const guestNamesTextarea = document.getElementById('rsvp-guest-names');
    
    if (!form || !statusSelect) return;

    // Controla se exibe ou oculta opções de acompanhantes baseados na resposta
    statusSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'sim') {
            guestsWrapper.style.display = 'flex';
            toggleNamesTextarea();
        } else {
            guestsWrapper.style.display = 'none';
            namesWrapper.classList.remove('show');
            guestsInput.value = 0;
            guestNamesTextarea.required = false;
        }
    });

    guestsInput.addEventListener('input', toggleNamesTextarea);

    function toggleNamesTextarea() {
        const guestsCount = parseInt(guestsInput.value) || 0;
        if (guestsCount > 0 && statusSelect.value === 'sim') {
            namesWrapper.classList.add('show');
            guestNamesTextarea.required = true;
        } else {
            namesWrapper.classList.remove('show');
            guestNamesTextarea.required = false;
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('rsvp-name').value;
        const status = statusSelect.value;
        const guests = guestsInput.value;
        const guestNames = guestNamesTextarea.value;
        const message = document.getElementById('rsvp-message').value;
        
        let statusText = status === 'sim' ? 'Sim, com certeza irei!' : 'Infelizmente não poderei comparecer';
        
        // Monta a mensagem para o WhatsApp
        let text = `*Confirmação de Presença - Casamento Vitor & Rayane*\n\n`;
        text += `• *Convidado:* ${name}\n`;
        text += `• *Confirmou:* ${statusText}\n`;
        
        if (status === 'sim') {
            text += `• *Acompanhantes:* ${guests}\n`;
            if (guests > 0 && guestNames.trim() !== '') {
                text += `• *Nomes dos Acompanhantes:*\n${guestNames}\n`;
            }
        }
        
        if (message.trim() !== '') {
            text += `\n• *Recadinho para os Noivos:*\n_"${message}"_\n`;
        }
        
        const phone = '5538998084847'; // Número de Vitor (38) 99808-4847
        const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
        
        // Abre o link do WhatsApp
        window.open(url, '_blank');
    });
}

/* ==========================================================================
   7. GERADOR DINÂMICO DE PIX EM VANILLA JS (CRC16)
   ========================================================================== */
function crc16CCITT(str) {
    let crc = 0xFFFF;
    const polynomial = 0x1021;
    
    for (let i = 0; i < str.length; i++) {
        let b = str.charCodeAt(i);
        crc ^= (b << 8);
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc <<= 1;
            }
            crc &= 0xFFFF;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function generatePixBRCode(key, name, city, amount, txid = '***') {
    // Limpa a chave CPF (apenas números)
    const cleanKey = key.replace(/\D/g, '');
    
    // 26 - Merchant Account Information (Pix)
    let accountInfo = '0014br.gov.bcb.pix';
    accountInfo += '01' + cleanKey.length.toString().padStart(2, '0') + cleanKey;
    
    const parts = {
        '00': '01',                  // Payload Format Indicator
        '26': accountInfo,           // Merchant Account Information
        '52': '0000',                // Merchant Category Code (padrão ISO)
        '53': '986',                 // Transaction Currency (986 = BRL)
    };
    
    if (amount > 0) {
        parts['54'] = amount.toFixed(2); // Transaction Amount
    }
    
    parts['58'] = 'BR';              // Country Code
    parts['59'] = name.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 25); // Nome do Beneficiário
    parts['60'] = city.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 15); // Cidade
    
    const txidPart = '05' + txid.length.toString().padStart(2, '0') + txid;
    parts['62'] = txidPart;          // Additional Data Field Template
    
    // Concatena as partes antes de calcular o checksum
    let payload = '';
    for (const [id, value] of Object.entries(parts)) {
        payload += id + value.length.toString().padStart(2, '0') + value;
    }
    payload += '6304'; // CRC16 Indicator
    
    const checksum = crc16CCITT(payload);
    return payload + checksum;
}

/* ==========================================================================
   8. LÓGICA DO MODAL DE PRESENTE (TAB & PIX GENERATOR)
   ========================================================================== */
let qrcodeInstance = null;

window.openGiftModal = function(giftName, amount) {
    const modal = document.getElementById('gift-modal');
    const modalTitle = document.getElementById('modal-gift-title');
    const modalName = document.getElementById('modal-gift-name');
    const modalValText = document.getElementById('modal-gift-val-text');
    
    if (!modal) return;
    
    modalTitle.textContent = `Presentear: ${giftName}`;
    modalName.textContent = giftName;
    
    if (amount > 0) {
        modalValText.textContent = `R$ ${amount.toFixed(2).replace('.', ',')}`;
    } else {
        modalValText.textContent = `Qualquer Valor`;
    }
    
    // Gera o código "Copia e Cola" do Pix
    // Chave: CPF Vitor Jacinto (12991278609), Nome: VITOR JACINTO, Cidade: UNAI
    const pixCode = generatePixBRCode('12991278609', 'Vitor Jacinto', 'Unai', amount, 'CASAMENTO');
    
    // Coloca o Pix no campo de cópia rápida
    const inputCopiaCola = document.getElementById('pix-copia-cola');
    if (inputCopiaCola) {
        inputCopiaCola.value = pixCode;
    }
    
    // Limpa e recria o QR Code na aba
    const qrContainer = document.getElementById('pix-qrcode');
    if (qrContainer) {
        qrContainer.innerHTML = ''; // Limpa QR anterior
        
        qrcodeInstance = new QRCode(qrContainer, {
            text: pixCode,
            width: 180,
            height: 180,
            colorDark : "#2C3531",
            colorLight : "#FAF8F5",
            correctLevel : QRCode.CorrectLevel.M
        });
    }
    
    // Mostra o Modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Impede rolagem de fundo
    
    // Reseta para a aba Pix por padrão
    switchGiftTab('pix');
};

window.closeGiftModal = function() {
    const modal = document.getElementById('gift-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
};

window.switchGiftTab = function(tabName) {
    const tabs = document.querySelectorAll('.modal-content .tab-btn');
    const contents = document.querySelectorAll('.modal-content .tab-content');
    
    tabs.forEach(tab => {
        if (tab.getAttribute('onclick').includes(tabName)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    contents.forEach(content => {
        if (content.id === `tab-${tabName}`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
};

window.copyPixCode = function() {
    const copyInput = document.getElementById('pix-copia-cola');
    const toast = document.getElementById('copy-toast');
    
    if (!copyInput) return;
    
    copyInput.select();
    copyInput.setSelectionRange(0, 99999); // Suporte para mobile
    
    navigator.clipboard.writeText(copyInput.value).then(() => {
        // Mostra animação Toast de sucesso
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }
    }).catch(err => {
        console.error('Falha ao copiar Pix: ', err);
    });
};

// Modal de Dress Code / Padrinhos
window.openDressCodeModal = function() {
    const modal = document.getElementById('dresscode-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
};

window.closeDressCodeModal = function() {
    const modal = document.getElementById('dresscode-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
};

// Fecha modais ao clicar no overlay de fundo escuro
window.addEventListener('click', (e) => {
    const giftModal = document.getElementById('gift-modal');
    const dresscodeModal = document.getElementById('dresscode-modal');
    
    if (e.target === giftModal) {
        closeGiftModal();
    }
    if (e.target === dresscodeModal) {
        closeDressCodeModal();
    }
});

/* ==========================================================================
   9. GALERIA LIGHTBOX INTEGRADA (CSS & JS)
   ========================================================================== */
let currentImageIndex = 0;
let galleryImagesList = [];

function initLightbox() {
    const galleryLinks = document.querySelectorAll('.gallery-link');
    galleryImagesList = Array.from(galleryLinks).map(link => ({
        src: link.getAttribute('href'),
        alt: link.querySelector('img').getAttribute('alt')
    }));
}

window.openLightbox = function(event, index) {
    event.preventDefault();
    
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (!lightbox || !lightboxImg) return;
    
    lightboxImg.src = galleryImagesList[currentImageIndex].src;
    lightboxCaption.textContent = galleryImagesList[currentImageIndex].alt;
    
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    }
};

window.changeLightboxImage = function(direction, event) {
    if (event) event.stopPropagation(); // Evita fechar o lightbox ao clicar nas setas
    
    currentImageIndex += direction;
    
    if (currentImageIndex >= galleryImagesList.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImagesList.length - 1;
    }
    
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (lightboxImg) {
        lightboxImg.src = galleryImagesList[currentImageIndex].src;
        lightboxCaption.textContent = galleryImagesList[currentImageIndex].alt;
    }
};

// Suporte a teclas direcionais e Esc no teclado para o Lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('show')) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight') {
        changeLightboxImage(1);
    } else if (e.key === 'ArrowLeft') {
        changeLightboxImage(-1);
    }
});
