# LLMS.md - CMD Directory (Command-Line Utilities)

## File Structure

```
src/cmd/
├── extract-content-from-pdf.ts    # CLI para extracción de contenido PDF
├── extract-highlights.ts          # CLI para extracción de highlights
├── generate-object-from-pdf.ts    # CLI para generación de objetos desde PDF
└── get-stored-pdf.ts              # CLI para recuperar PDFs almacenados
```

## Business Relevance

### Utilidades de Desarrollo y Testing:

1. **🔧 Herramientas de Desarrollo Local**
   - Scripts ejecutables para desarrollo y debugging
   - Permiten probar funcionalidades de forma aislada
   - Facilitan el desarrollo sin depender de la interfaz web
   - Útiles para validar pipelines de procesamiento

2. **📄 Testing de Procesamiento PDF**
   - **extract-content-from-pdf.ts**: Prueba la extracción de contenido de contratos
   - **extract-highlights.ts**: Valida el sistema de detección de cláusulas
   - **generate-object-from-pdf.ts**: Testa la generación de objetos estructurados
   - **get-stored-pdf.ts**: Verifica la recuperación de PDFs almacenados

3. **🎯 Validación de IA**
   - Permiten testear prompts y respuestas de IA de forma directa
   - Facilitan la iteración en el desarrollo de extractores
   - Útiles para verificar calidad de análisis hipotecario

## Key CLI Scripts

### extract-content-from-pdf.ts
```typescript
// Ejecuta la acción de extracción de contenido
// Ejemplo: node src/cmd/extract-content-from-pdf.ts
// Utiliza: @/actions/extract-content-from-pdf
```

### extract-highlights.ts
```typescript
// Testa el sistema de detección de highlights
// Procesa chunks de contrato y extrae cláusulas
// Ejemplo con datos reales de hipoteca ING
// Útil para validar tipos de highlights españoles
```

### generate-object-from-pdf.ts
```typescript
// Genera objetos estructurados desde PDF
// Útil para testing de schemas de datos
```

### get-stored-pdf.ts
```typescript
// Recupera PDFs desde almacenamiento
// Valida sistema de persistencia
```

## Development Usage

### Ejecución Local:
```bash
# Extraer contenido de PDF
bun src/cmd/extract-content-from-pdf.ts

# Procesar highlights de contrato
bun src/cmd/extract-highlights.ts

# Generar objeto desde PDF
bun src/cmd/generate-object-from-pdf.ts

# Recuperar PDF almacenado
bun src/cmd/get-stored-pdf.ts
```

### Testing de IA:
- Valida extracción de cláusulas hipotecarias
- Prueba detección de riesgos financieros
- Verifica clasificación de highlights por tipos
- Testa prompts de sistema para mercado español

## Change-Log

### Initial Implementation (June 2025)
- Creación de utilidades CLI para desarrollo
- Scripts de testing para pipeline de PDF
- Herramientas de validación de IA
- Utilities para debugging de procesamiento

### Usage Examples
```bash
# Testing completo del pipeline
bun src/cmd/extract-content-from-pdf.ts
bun src/cmd/extract-highlights.ts

# Validación de datos
bun src/cmd/get-stored-pdf.ts
```

## Architecture Notes

### Design Patterns:
- **CLI Wrapper Pattern**: Encapsulan acciones y triggers existentes
- **Direct Execution**: Scripts autónomos para testing rápido
- **Modular Testing**: Cada script prueba una funcionalidad específica
- **Data Validation**: Útiles para verificar calidad de datos

### Dependencies:
- Reutilizan código de `/src/actions/` y `/src/triggers/`
- No duplican lógica de negocio
- Proporcionan interfaces de línea de comandos simples
- Facilitan debugging y desarrollo iterativo

### Spanish Market Context:
- **extract-highlights.ts** incluye datos reales de hipoteca española (ING)
- Valida detección de TAE, TIN, y cuotas mensuales
- Prueba clasificación de cláusulas según normativa española
- Verifica análisis de riesgos para consumidores españoles

## Development Guidelines

### Best Practices:
- Usar para testing rápido de funcionalidades aisladas
- Validar cambios en prompts antes de deploy
- Probar extracciones con contratos reales españoles
- Verificar calidad de highlights y clasificaciones

### Error Handling:
- Manejar errores de forma clara para debugging
- Proporcionar output útil para desarrollo
- Logs detallados para troubleshooting

### Spanish Consumer Focus:
- Testing con terminología hipotecaria española
- Validación de detección de cláusulas abusivas
- Verificación de análisis de riesgos para B2C
- Pruebas con formatos de contrato del mercado español