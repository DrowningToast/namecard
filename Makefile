# Development tasks for the namecard site.
#
#   make            list targets
#   make setup      install everything needed to work on this repo
#   make check      verify the toolchain without installing (CI-friendly)
#
# File targets carry real prerequisites, so `make resume-pdf` is a no-op when
# public/resume.pdf is already newer than the data it came from.

.DEFAULT_GOAL := help
SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

# Keep in sync with the Vercel runtime. scripts/resume.ts relies on native
# TypeScript stripping (Node 22.6+).
NODE_MAJOR_MIN    := 22
NODE_MAJOR_TARGET := 24

# Preference order matches the ENGINES list in scripts/resume.ts.
LATEX_ENGINE := $(firstword $(foreach e,tectonic latexmk pdflatex,\
                  $(if $(shell command -v $(e) 2>/dev/null),$(e))))

# Anything whose change should invalidate the generated résumé.
RESUME_SRC := src/data/resume.ts \
              src/lib/resume-format.ts \
              scripts/resume.ts \
              scripts/lib/to-latex.ts \
              scripts/templates/preamble.tex

TEX := build/resume.tex
PDF := public/resume.pdf

BOLD := \033[1m
DIM  := \033[2m
OK   := \033[32m
WARN := \033[33m
ERR  := \033[31m
OFF  := \033[0m

## ---------------------------------------------------------------------- help

.PHONY: help
help: ## Show this help
	@printf '$(BOLD)Targets$(OFF)\n'
	@grep -hE '^[a-z][a-zA-Z0-9_-]*:.*?## ' $(MAKEFILE_LIST) \
		| awk -F':.*?## ' '{printf "  $(OK)%-12s$(OFF) %s\n", $$1, $$2}'
	@printf '\n$(DIM)LaTeX engine: $(if $(LATEX_ENGINE),$(LATEX_ENGINE),none — run make setup)$(OFF)\n\n'

## --------------------------------------------------------------------- setup

node_modules: package.json pnpm-lock.yaml
	@printf '$(BOLD)Installing dependencies$(OFF)\n'
	@pnpm install
	@touch node_modules

.PHONY: setup
setup: node_modules ## Install dependencies and the LaTeX engine
ifeq ($(LATEX_ENGINE),)
	@printf '\n$(WARN)!$(OFF) No LaTeX engine found.\n'
	@if command -v brew >/dev/null 2>&1; then \
		printf '  installing tectonic (~50 MB, self-contained; MacTeX is ~5 GB)\n'; \
		brew install tectonic; \
	else \
		printf '  $(DIM)install one of: tectonic (recommended), latexmk, pdflatex$(OFF)\n'; \
		printf '  $(DIM)only "make resume-pdf" needs it$(OFF)\n'; \
	fi
else
	@printf '$(OK)✓$(OFF) LaTeX engine: $(LATEX_ENGINE)\n'
endif
	@printf '\n$(OK)✓$(OFF) ready — try $(BOLD)make dev$(OFF)\n\n'

.PHONY: check
check: ## Verify the toolchain without installing anything
	@missing=0; \
	printf '$(BOLD)Runtime$(OFF)\n'; \
	if command -v node >/dev/null 2>&1; then \
		major=$$(node -v | sed 's/^v\([0-9]*\).*/\1/'); \
		if [ "$$major" -lt $(NODE_MAJOR_MIN) ]; then \
			printf '  $(ERR)✗$(OFF) Node %s — need v$(NODE_MAJOR_MIN)+ (scripts/resume.ts runs .ts directly)\n' "$$(node -v)"; \
			missing=$$((missing+1)); \
		elif [ "$$major" -gt $(NODE_MAJOR_TARGET) ]; then \
			printf '  $(OK)✓$(OFF) Node %s\n' "$$(node -v)"; \
			printf '  $(WARN)!$(OFF) Vercel Functions run Node $(NODE_MAJOR_TARGET); local is newer\n'; \
			printf '    $(DIM)harmless for this static site$(OFF)\n'; \
		else \
			printf '  $(OK)✓$(OFF) Node %s\n' "$$(node -v)"; \
		fi; \
	else \
		printf '  $(ERR)✗$(OFF) Node not found — need v$(NODE_MAJOR_MIN)+\n'; \
		missing=$$((missing+1)); \
	fi; \
	if command -v pnpm >/dev/null 2>&1; then \
		printf '  $(OK)✓$(OFF) pnpm %s\n' "$$(pnpm -v)"; \
	else \
		printf '  $(ERR)✗$(OFF) pnpm not found — corepack enable pnpm\n'; \
		missing=$$((missing+1)); \
	fi; \
	printf '\n$(BOLD)Packages$(OFF)\n'; \
	if [ -d node_modules ]; then \
		printf '  $(OK)✓$(OFF) node_modules present\n'; \
	else \
		printf '  $(ERR)✗$(OFF) node_modules missing — make setup\n'; \
		missing=$$((missing+1)); \
	fi; \
	printf '\n$(BOLD)LaTeX$(OFF) $(DIM)(résumé PDF only)$(OFF)\n'; \
	if [ -n "$(LATEX_ENGINE)" ]; then \
		printf '  $(OK)✓$(OFF) $(LATEX_ENGINE)\n'; \
	else \
		printf '  $(WARN)!$(OFF) none — "make resume-pdf" unavailable, everything else works\n'; \
	fi; \
	printf '\n'; \
	if [ "$$missing" -gt 0 ]; then \
		[ "$$missing" -eq 1 ] && noun=dependency || noun=dependencies; \
		printf '$(ERR)✗$(OFF) %s required %s missing\n\n' "$$missing" "$$noun"; \
		exit 1; \
	fi; \
	printf '$(OK)✓$(OFF) ready\n\n'

## ----------------------------------------------------------------- dev loops

.PHONY: dev
dev: node_modules ## Run the dev server on :4321
	@pnpm dev

.PHONY: build
build: node_modules ## Production build into dist/
	@pnpm build

.PHONY: test
test: node_modules ## Run the unit tests
	@pnpm test

.PHONY: watch
watch: node_modules ## Run the unit tests in watch mode
	@pnpm test:watch

## -------------------------------------------------------------------- résumé

$(TEX): $(RESUME_SRC) | node_modules
	@node scripts/resume.ts

$(PDF): $(TEX)
ifeq ($(LATEX_ENGINE),)
	@printf '$(ERR)✗$(OFF) No LaTeX engine. Run $(BOLD)make setup$(OFF), or:\n'
	@printf '    brew install tectonic\n'
	@printf '  $(DIM)$(TEX) is written and valid — only the PDF step is blocked.$(OFF)\n'
	@exit 1
else
	@node scripts/resume.ts --pdf
endif

.PHONY: resume
resume: $(TEX) ## Generate build/resume.tex from src/data/resume.ts

.PHONY: resume-pdf
resume-pdf: $(PDF) ## Compile the résumé to public/resume.pdf

.PHONY: resume-check
resume-check: | node_modules ## Fail if build/resume.tex is stale (CI gate)
	@node scripts/resume.ts --check

## --------------------------------------------------------------------- clean

.PHONY: clean
clean: ## Remove build output
	@rm -rf dist .vercel .astro build
	@printf '$(OK)✓$(OFF) cleaned\n'

.PHONY: distclean
distclean: clean ## Also remove node_modules and the generated PDF
	@rm -rf node_modules $(PDF)
	@printf '$(OK)✓$(OFF) removed node_modules and $(PDF)\n'
