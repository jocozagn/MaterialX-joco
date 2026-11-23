document.addEventListener('DOMContentLoaded', () => {
    const bookingIframe = document.querySelector('.booking-frame iframe');
    const bookingMinHeight = () => {
        if (window.matchMedia('(max-width: 480px)').matches) {
            return 740;
        }
        if (window.matchMedia('(max-width: 980px)').matches) {
            return 680;
        }
        return 620;
    };
    const applyBookingHeight = (value) => {
        const height = Math.round(Number(value));
        if (!Number.isFinite(height) || height < 160 || height > 2400) {
            return;
        }
        const next = Math.max(height, bookingMinHeight()) + 'px';
        bookingIframe.style.height = next;
        const frame = bookingIframe.closest('.booking-frame');
        if (frame) {
            if (window.matchMedia('(max-width: 980px)').matches) {
                frame.style.height = next;
            } else {
                frame.style.removeProperty('height');
            }
        }
    };
    const readPostedHeight = (data) => {
        if (data == null) {
            return null;
        }
        if (typeof data === 'number') {
            return data;
        }
        if (typeof data === 'string') {
            if (data.startsWith('[iFrameSizer]')) {
                const parts = data.split(':');
                return Number(parts[1]) || Number(parts[2]) || null;
            }
            try {
                data = JSON.parse(data);
            } catch {
                return Number.parseFloat(data) || null;
            }
        }
        if (typeof data !== 'object') {
            return null;
        }
        return data.frameHeight ?? data.iframeHeight ?? data.height ?? data.Height
            ?? data.scrollHeight ?? data?.data?.height ?? data?.payload?.height ?? null;
    };
    if (bookingIframe) {
        const bookingSection = bookingIframe.closest('.booking-section');
        const bookingFrame = bookingIframe.closest('.booking-frame');
        const setBookingUsing = (on) => bookingSection?.classList.toggle('is-using', on);
        bookingIframe.style.width = '100%';
        applyBookingHeight(bookingMinHeight());
        bookingFrame?.addEventListener('pointerdown', () => setBookingUsing(true));
        bookingFrame?.addEventListener('mouseleave', () => setBookingUsing(false));
        document.addEventListener('pointerdown', (event) => {
            if (!bookingFrame?.contains(event.target)) {
                setBookingUsing(false);
            }
        });
        window.addEventListener('message', (event) => {
            if (event.source && event.source !== bookingIframe.contentWindow) {
                return;
            }
            applyBookingHeight(readPostedHeight(event.data));
        });
        window.addEventListener('resize', () => {
            const current = Number.parseFloat(bookingIframe.style.height) || bookingMinHeight();
            applyBookingHeight(current);
        });
    }

    const toggle = document.querySelector('[data-nav-toggle]');
    const closeBtn = document.querySelector('[data-nav-close]');
    const nav = document.querySelector('[data-nav]');
    const backdrop = document.querySelector('[data-nav-backdrop]');

    const setOpen = (open) => {
        nav?.classList.toggle('is-open', open);
        backdrop?.classList.toggle('is-open', open);
        toggle?.classList.toggle('is-active', open);
        toggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('nav-locked', open);
    };

    const closeLangMenus = () => {
        document.querySelectorAll('.lang-switch.is-open').forEach((menu) => {
            menu.classList.remove('is-open');
            menu.querySelector('[data-lang-toggle]')?.setAttribute('aria-expanded', 'false');
        });
    };

    const closeFlightActions = () => {
        document.querySelectorAll('.flight-card.is-actions-open').forEach((card) => {
            card.classList.remove('is-actions-open');
            card.querySelector('[data-flight-media]')?.setAttribute('aria-expanded', 'false');
        });
    };

    const collapseExpandedAccordions = () => {
        let collapsed = false;
        nav?.querySelectorAll('.has-mega.is-expanded, .lang-menu.is-expanded').forEach((item) => {
            item.classList.remove('is-expanded');
            item.querySelector('[data-acc-toggle]')?.setAttribute('aria-expanded', 'false');
            collapsed = true;
        });
        return collapsed;
    };

    toggle?.addEventListener('click', () => {
        closeLangMenus();
        setOpen(!nav?.classList.contains('is-open'));
    });
    closeBtn?.addEventListener('click', () => {
        // First X press closes only the open submenu; second closes the drawer.
        if (collapseExpandedAccordions()) {
            return;
        }
        setOpen(false);
    });
    backdrop?.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (collapseExpandedAccordions()) {
                return;
            }
            setOpen(false);
            closeLangMenus();
            closeFlightActions();
        }
    });

    document.querySelectorAll('[data-acc-toggle]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const item = button.closest('.has-mega, .lang-menu');
            const willOpen = !item?.classList.contains('is-expanded');
            item?.parentElement?.querySelectorAll(':scope > .has-mega, :scope > .lang-menu').forEach((sibling) => {
                sibling.classList.remove('is-expanded');
                sibling.querySelector('[data-acc-toggle]')?.setAttribute('aria-expanded', 'false');
            });
            item?.classList.toggle('is-expanded', willOpen);
            button.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
    });

    document.querySelectorAll('[data-lang-toggle]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const menu = button.closest('.lang-switch');
            const willOpen = !menu?.classList.contains('is-open');
            closeLangMenus();
            if (willOpen && menu) {
                menu.classList.add('is-open');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.lang-switch')) {
            closeLangMenus();
        }
    });

    document.querySelectorAll('[data-dest-filter]').forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-dest-filter');
            const grid = document.querySelector('[data-dest-grid]');
            button.parentElement?.querySelectorAll('[data-dest-filter]').forEach((sibling) => {
                sibling.classList.toggle('is-active', sibling === button);
            });
            grid?.querySelectorAll('.dest-place').forEach((card) => {
                const kind = card.getAttribute('data-kind');
                card.classList.toggle('is-hidden', filter !== 'all' && kind !== filter);
            });
        });
    });

    const helpSearch = document.querySelector('[data-help-search]');
    if (helpSearch) {
        const items = [...document.querySelectorAll('[data-help-item]')];
        const empty = document.querySelector('[data-help-empty]');
        helpSearch.addEventListener('input', () => {
            const query = helpSearch.value.trim().toLowerCase();
            let visible = 0;
            items.forEach((item) => {
                const haystack = item.getAttribute('data-search') || '';
                const match = !query || haystack.includes(query);
                item.hidden = !match;
                if (match) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible > 0;
            }
        });
    }

    const fareList = document.querySelector('[data-fare-list]');
    if (fareList) {
        const cards = [...fareList.querySelectorAll('[data-fare]')];
        const search = document.querySelector('[data-fare-search]');
        const empty = document.querySelector('[data-fare-empty]');
        const pager = document.querySelector('[data-fare-pages]');
        const perPage = 8;
        let cabin = 'all';
        let page = 1;

        const filteredCards = () => {
            const query = (search?.value || '').trim().toLowerCase();
            return cards.filter((card) => {
                const cabinOk = cabin === 'all' || card.getAttribute('data-cabin') === cabin;
                const haystack = card.getAttribute('data-search') || '';
                return cabinOk && (!query || haystack.includes(query));
            });
        };

        const render = () => {
            const matches = filteredCards();
            const totalPages = Math.max(1, Math.ceil(matches.length / perPage));
            if (page > totalPages) {
                page = totalPages;
            }
            cards.forEach((card) => {
                card.hidden = true;
            });
            matches.slice((page - 1) * perPage, page * perPage).forEach((card) => {
                card.hidden = false;
            });
            if (empty) {
                empty.hidden = matches.length > 0;
            }
            if (!pager) {
                return;
            }
            pager.innerHTML = '';
            pager.hidden = matches.length === 0 || totalPages < 2;
            if (pager.hidden) {
                return;
            }
            const addBtn = (label, target, opts = {}) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = label;
                btn.disabled = Boolean(opts.disabled);
                if (opts.active) {
                    btn.classList.add('is-active');
                }
                btn.addEventListener('click', () => {
                    page = target;
                    render();
                    fareList.scrollIntoView({ block: 'start', behavior: 'smooth' });
                });
                pager.appendChild(btn);
            };
            addBtn('‹', page - 1, { disabled: page <= 1 });
            for (let i = 1; i <= totalPages; i += 1) {
                addBtn(String(i), i, { active: i === page });
            }
            addBtn('›', page + 1, { disabled: page >= totalPages });
        };

        search?.addEventListener('input', () => {
            page = 1;
            render();
        });
        document.querySelectorAll('[data-fare-cabin]').forEach((button) => {
            button.addEventListener('click', () => {
                cabin = button.getAttribute('data-fare-cabin') || 'all';
                button.parentElement?.querySelectorAll('[data-fare-cabin]').forEach((sibling) => {
                    sibling.classList.toggle('is-active', sibling === button);
                });
                page = 1;
                render();
            });
        });
        render();
    }

    const touchLikeCards = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (touchLikeCards) {
        document.querySelectorAll('.flight-card').forEach((card) => {
            const media = card.querySelector('[data-flight-media]');
            const hover = card.querySelector('.flight-hover');
            if (!media || !hover) {
                return;
            }

            media.setAttribute('aria-expanded', 'false');

            media.addEventListener('click', (event) => {
                if (event.target.closest('.flight-hover a')) {
                    return;
                }

                if (card.classList.contains('is-actions-open')) {
                    if (event.target === hover) {
                        card.classList.remove('is-actions-open');
                        media.setAttribute('aria-expanded', 'false');
                    }
                    return;
                }

                event.preventDefault();
                closeFlightActions();
                card.classList.add('is-actions-open');
                media.setAttribute('aria-expanded', 'true');
            });

            hover.addEventListener('click', (event) => {
                if (event.target === hover) {
                    card.classList.remove('is-actions-open');
                    media.setAttribute('aria-expanded', 'false');
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.flight-card')) {
                closeFlightActions();
            }
        });
    }

    const lightbox = document.querySelector('[data-gallery-lightbox]');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxCap = lightbox.querySelector('[data-gallery-caption]');
        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.classList.remove('gallery-open');
            if (lightboxImg) {
                lightboxImg.removeAttribute('src');
            }
        };
        document.querySelectorAll('[data-gallery-open]').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                if (lightboxImg) {
                    lightboxImg.src = link.getAttribute('href');
                    lightboxImg.alt = link.getAttribute('data-gallery-caption') || '';
                }
                if (lightboxCap) {
                    lightboxCap.textContent = link.getAttribute('data-gallery-caption') || '';
                }
                lightbox.hidden = false;
                document.body.classList.add('gallery-open');
            });
        });
        lightbox.querySelector('[data-gallery-close]')?.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !lightbox.hidden) {
                closeLightbox();
            }
        });
    }

    const slider = document.querySelector('[data-slider]');
    if (!slider) {
        return;
    }

    const slides = [...slider.querySelectorAll('.slide')];
    const dotsWrap = slider.querySelector('[data-slider-dots]');
    let index = 0;
    let timer;
    let busy = false;

    const goTo = (next) => {
        const target = (next + slides.length) % slides.length;
        if (busy || target === index || !slides[target]) {
            return;
        }

        busy = true;
        const current = slides[index];
        current.classList.add('is-leaving');
        dotsWrap?.children[index]?.classList.remove('is-active');
        dotsWrap?.children[target]?.classList.add('is-active');

        window.setTimeout(() => {
            current.classList.remove('is-active', 'is-leaving');
            index = target;
            slides[index].classList.add('is-active');
            busy = false;
        }, 420);
    };

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        if (i === 0) {
            dot.classList.add('is-active');
        }
        dot.addEventListener('click', () => {
            goTo(i);
            restart();
        });
        dotsWrap?.appendChild(dot);
    });

    const restart = () => {
        clearInterval(timer);
        timer = setInterval(() => goTo(index + 1), 6500);
    };

    restart();
});
