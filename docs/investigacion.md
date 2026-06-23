# Reporte de Parámetros de Liquidación y

# Cotización Laboral para México, El

# Salvador, Colombia y Perú

El desarrollo de un motor de cálculo laboral de código abierto como el del proyecto Justo
requiere un modelado preciso de las variables fiscales y de seguridad social de cada país. La
transición de parámetros fijos o codificados directamente en el código fuente ( _hardcoded_ )
hacia una arquitectura de datos histórica y dinámica constituye un requisito fundamental para
garantizar la validez legal de las liquidaciones en escenarios multi-año. Este reporte
proporciona el análisis técnico, los datos normativos históricos correspondientes al período
2021-2025 y las propuestas de estructuración de bases de datos necesarias para corregir las
inconsistencias detectadas en los componentes de salarios mínimos de México, El Salvador y
Colombia, así como en la tasa de cotización del Sistema Privado de Pensiones (AFP) de Perú.

## 1. Salarios mínimos generales e históricos (2021-2025)

El análisis del mercado laboral hispanoamericano demuestra que el concepto de "salario
mínimo mensual" no siempre se reduce a una cifra plana nacional. Existen factores como la
división geográfica, la sectorización económica y los subsidios no prestacionales obligatorios
que determinan la base real de cotización y liquidación de un trabajador.

### México (MX)

La Comisión Nacional de los Salarios Mínimos (CONASAMI) es el órgano gubernamental
facultado para definir las bases salariales en el país^1. El territorio mexicano se divide legalmente
en dos regiones diferenciadas: la Zona Libre de la Frontera Norte (ZLFN) y el Resto del País
(asociado a la Zona del Salario Mínimo General o ZSMG)^1.
Es de vital importancia corregir la suposición técnica de que el salario mínimo mexicano está
definido de manera mensual. La CONASAMI establece de forma oficial una tarifa **diaria**^1. La
cifra de $8,364 MXN mensuales utilizada en el entorno de desarrollo del proyecto Justo es, en
realidad, el resultado de multiplicar el salario diario general de 2025 ($278.80 MXN) por un
factor estándar de 30 días para efectos fiscales y administrativos^1. Para la Zona Libre de la
Frontera Norte, el salario diario vigente para 2025 asciende a $419.88 MXN, equivalente a
$12,596.40 MXN bajo el mismo estándar mensual de 30 días^1.

```
Año de
Vigencia
```
```
Salario Diario
ZSMG (Resto
del País)
```
```
Salario Diario
ZLFN
(Frontera
Norte)
```
```
Norma /
Resolución
Oficial
```
```
Confianza de
la Fuente
```

##### 2021 $141.70 MXN $213.39 MXN DOF

##### 23/12/2020^5

```
Oficial
[cite: 2]
```
```
2022 $172.87 MXN $260.34 MXN DOF
08/12/2021^5
```
```
Oficial
[cite: 2]
```
```
2023 $207.44 MXN $312.41 MXN DOF
07/12/2022^5
```
```
Oficial
[cite: 2]
```
```
2024 $248.93 MXN $374.89 MXN DOF
12/12/2023^5
```
```
Oficial
[cite: 2]
```
```
2025 $278.80 MXN $419.88 MXN DOF
19/12/2024^3
```
```
Oficial
[cite: 2]
```
El portal oficial de consulta es el micrositio de la CONASAMI dentro de la plataforma
gubernamental del Gobierno de México (https://www.gob.mx/conasami), donde se publican las
resoluciones de manera anual^2.

### El Salvador (SV)

En el contexto salvadoreño, las variaciones salariales son administradas por el Consejo Nacional
del Salario Mínimo (CNSM) y decretadas formalmente por el órgano ejecutivo a través del
Ministerio de Trabajo y Previsión Social (MTPS), entidad frecuentemente referida en los
repositorios de desarrollo mediante el acrónimo MTEPS^6.
A diferencia de otros países, la legislación salvadoreña divide los salarios mínimos según
sectores productivos: Comercio y Servicios, Industria, Maquila Textil y Confección, y el Sector
Agrícola^8. El valor de $365.00 USD, que el proyecto Justo mantenía preestablecido para 2025,
corresponde únicamente al período de vigencia de agosto de 2021 a mayo de 2025 para el
sector de Comercio y Servicios^9. A partir del **1 de junio de 2025** , entró en vigor el Decreto
Ejecutivo No. 11, que decretó un incremento generalizado de las tasas sectoriales, elevando el
salario mínimo de Comercio, Servicios e Industria a $408.80 USD mensuales^9.

```
Período de
Vigencia
```
```
Sector
Comercio
y Servicios
(Mensual)
```
```
Maquila
Textil y
Confecció
n
(Mensual)
```
```
Sector
Agrícola
(Mensual)
```
```
Base Legal
/ Diario
Oficial
```
```
Confianza
de la
Fuente
```
```
Ene 2021 –
Jul 2021
```
##### $304.

##### USD

##### $299.

##### USD

```
$202.88 a
$227.22 USD
```
```
Acuerdo de
201812
```
```
Oficial
[cite: 7, 12]
```

```
Ago 2021 –
May 2025
```
##### $365.

##### USD

##### $359.16 USD $243.

##### USD

```
Decretos
No. 9 y 10
(D.O.
07/07/2021)
7
```
```
Oficial
[cite: 7, 10]
```
```
Jun 2025 –
Dic 2025
```
##### $408.

##### USD

##### $402.

##### USD

##### $305.

##### USD

```
Decreto No.
11 (D.O.
23/05/2025)
9
```
```
Oficial
[cite: 7, 10]
```
La determinación diaria y por hora en El Salvador se rige por fórmulas estipuladas en el Código
de Trabajo que reconocen de forma implícita los fines de semana y descansos anuales
pagados^10 :

[cite: 10]

[cite: 10]
La documentación legislativa y las tablas de salarios vigentes se obtienen directamente a
través del repositorio institucional del Ministerio de Trabajo y Previsión Social
(https://www.mtps.gob.sv/descargas/)^7.

### Colombia (CO)

La determinación del salario mínimo en Colombia compete a la Comisión de Concertación de
Políticas Salariales y Laborales, que reúne al Ministerio del Trabajo (MINTRABAJO), gremios
patronales y sindicatos^15. Si no se alcanza un consenso tripartito en los plazos de ley, el
Presidente de la República expide unilateralmente el decreto reglamentario respectivo^15.
Para efectos de una liquidación laboral precisa en Colombia, resulta indispensable modelar por
separado el Salario Mínimo Mensual Legal Vigente (SMMLV) y el **Auxilio de Transporte**^17. Este
último constituye una prestación económica legal de carácter no salarial que el empleador
debe abonar mensualmente a todo trabajador que devengue hasta dos (2) SMMLV, con el
propósito de subsidiar el traslado de la residencia al puesto de trabajo^17. Aunque este subsidio
no está afecto a cotizaciones de seguridad social (salud, pensión ni parafiscales), sí se incluye
obligatoriamente en la base de cálculo de las prestaciones sociales de prima de servicios y
cesantías, lo cual representa un comportamiento normativo que el motor del software del
proyecto Justo debe aislar y resolver^17.


```
Año de
Vigencia
```
##### SMMLV

```
(Básico
Mensual)
```
```
Auxilio de
Transporte
(Mensual)
```
```
Decretos
Presidenciales
```
```
Confianza de
la Fuente
```
```
2021 $908,526 COP $106,454 COP Decretos 1785
y 1786 de
202020
```
```
Oficial
[cite: 20, 21]
```
##### 2022 $1,000,

##### COP

```
$117,172 COP Decretos 1724
y 1725 de
202120
```
```
Oficial
[cite: 20, 23]
```
##### 2023 $1,160,

##### COP

```
$140,606 COP Decretos 2623
y 2624 de
202220
```
```
Oficial
[cite: 20]
```
##### 2024 $1,300,

##### COP

```
$162,000 COP Decretos 2292
y 2293 de
202320
```
```
Oficial
[cite: 20, 24]
```
##### 2025 $1,423,

##### COP

```
$200,000 COP Decretos 1572
y 1573 de
202417
```
```
Oficial
[cite: 20, 25]
```
La base documental e histórica de estos decretos se encuentra centralizada en el Gestor
Normativo del Departamento Administrativo de la Función Pública de la República de Colombia
(https://www.funcionpublica.gov.co/eva/gestornormativo/)^21.

### Frecuencia de actualización y meses típicos de publicación

Un factor clave para evitar la obsolescencia de los módulos de cálculo consiste en programar
un monitoreo automatizado de acuerdo con los calendarios de publicación institucional de
cada país:
● **México (CONASAMI):** Frecuencia de actualización anual^22. Las discusiones del consejo
de representantes tienen lugar entre los meses de noviembre y diciembre^4. El decreto de
salarios mínimos generales y profesionales se publica de forma regular en el Diario Oficial
de la Federación a **mediados de diciembre** (usualmente entre el 10 y el 23 de ese mes) y
su vigencia inicia de manera invariable el 1 de enero del año entrante^5.
● **Colombia (MINTRABAJO):** Frecuencia de actualización anual^22. La mesa de
concertación sesiona durante todo el mes de diciembre^26. Por mandato constitucional, el
decreto del salario mínimo y del auxilio de transporte debe ser expedido por el gobierno
a más tardar el **30 de diciembre** de cada año calendario para surtir efectos obligatorios
el 1 de enero inmediato^16.


```
● El Salvador (MTPS): Frecuencia de actualización no periódica^7. La legislación obliga a
una revisión del pliego tarifario por lo menos cada tres años, atendiendo principalmente a
los índices de costo de la vida local^12. Por consiguiente, los incrementos pueden
decretarse en cualquier mes del año y su vigencia se estipula en el cuerpo de cada
Decreto Ejecutivo publicado en el Diario Oficial^9. El sistema del proyecto Justo debe
implementar un mecanismo de monitoreo preventivo o una interfaz administrativa para
actualizar las bases de datos de forma oportuna cuando surja una modificación
regulatoria.
```
### Propuesta de estructura de datos escalable para soporte multi-año

Para dar soporte integral a las variaciones espot temporales, la segmentación regional
mexicana y la clasificación por sectores salvadoreños, la estructura del archivo
packages/core/src/shared/minimum-wages.ts debe abandonar el formato estático
unidimensional. Se propone un esquema relacional u objeto de configuración jerárquico
basado en intervalos de tiempo estrictos y metadatos de segmentación:

```
TypeScript
export interface WageValue {
amount: number; // El monto base
currency: string; // Código ISO de moneda (MXN, USD, COP)
basis: 'daily' | 'monthly'; // Unidad de fijación de la norma
auxiliaryAmount?: number; // Destinado a subsidios obligatorios (ej. Auxilio de Transporte en
CO)
}
```
```
export interface WageParameterRule {
countryCode: 'MX' | 'SV' | 'CO';
regionCode: 'GLOBAL' | 'ZLFN' | 'ZSMG'; // Subdivisiones geográficas de México
sectorCode: 'GLOBAL' | 'COMERCIO_SERVICIOS' | 'MAQUILA' | 'AGRICOLA'; // Sectores de El
Salvador
validFrom: string; // Fecha de inicio de vigencia (Formato ISO: YYYY-MM-DD)
validTo: string | null; // Fecha de finalización (null si sigue vigente de forma indefinida)
parameters: WageValue;
officialSourceUrl: string; // URL de verificación legal para auditorías de nómina
}
```
```
// Registro histórico unificado para su integración en el core de Justo
export const minimumWagesRegistry: WageParameterRule[] = [
```

// MÉXICO (2025) - Zona General
{
countryCode: 'MX',
regionCode: 'ZSMG',
sectorCode: 'GLOBAL',
validFrom: '2025-01-01',
validTo: '2025-12-31',
parameters: { amount: 278.80, currency: 'MXN', basis: 'daily' },
officialSourceUrl:
'https://www.gob.mx/conasami/documentos/tabla-de-salarios-minimos-generales-y-profesionales
-por-areas-geograficas'
},
// MÉXICO (2025) - Frontera Norte
{
countryCode: 'MX',
regionCode: 'ZLFN',
sectorCode: 'GLOBAL',
validFrom: '2025-01-01',
validTo: '2025-12-31',
parameters: { amount: 419.88, currency: 'MXN', basis: 'daily' },
officialSourceUrl:
'https://www.gob.mx/conasami/documentos/tabla-de-salarios-minimos-generales-y-profesionales
-por-areas-geograficas'
},
// EL SALVADOR (Fase 1: Ago 2021 - May 2025) - Sector Comercio
{
countryCode: 'SV',
regionCode: 'GLOBAL',
sectorCode: 'COMERCIO_SERVICIOS',
validFrom: '2021-08-01',
validTo: '2025-05-31',
parameters: { amount: 365.00, currency: 'USD', basis: 'monthly' },
officialSourceUrl: 'https://www.mtps.gob.sv/descargas/'
},
// EL SALVADOR (Fase 2: Jun 2025 - Vigente) - Sector Comercio
{
countryCode: 'SV',
regionCode: 'GLOBAL',
sectorCode: 'COMERCIO_SERVICIOS',
validFrom: '2025-06-01',
validTo: null,
parameters: { amount: 408.80, currency: 'USD', basis: 'monthly' },
officialSourceUrl: 'https://www.mtps.gob.sv/descargas/'


##### },

```
// COLOMBIA (2025) - Unificado Nacional
{
countryCode: 'CO',
regionCode: 'GLOBAL',
sectorCode: 'GLOBAL',
validFrom: '2025-01-01',
validTo: '2025-12-31',
parameters: { amount: 1423500.00, currency: 'COP', basis: 'monthly', auxiliaryAmount:
200000.00 },
officialSourceUrl: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=257156'
}
];
```
Con este modelo de datos, la calculadora puede deducir la base salarial de forma dinámica
evaluando las condiciones de la fecha del devengo o despido del empleado, permitiendo
procesar auditorías y liquidaciones retroactivas de forma automática.

## 2. Tasa AFP Perú — previsión social privada

El Sistema Privado de Pensiones en el Perú está sujeto al escrutinio normativo de la
Superintendencia de Banca, Seguros y AFP (SBS)^27. La constante fija de afpRate: 0.112 (11.2%)
actualmente integrada en el módulo de liquidación peruana
(packages/core/src/settlement/pe/calculate.ts) presenta imprecisiones conceptuales y
estructurales severas que pueden traducirse en cálculos de planilla erróneos.

### Desglose analítico de la cotización previsional en el sistema peruano

Toda retención previsional que efectúa un empleador en una planilla formal de remuneración
en el Perú se divide en tres conceptos diferenciados determinados por la SBS^27 :

1. **Aporte Obligatorio al Fondo de Pensiones:** Destinado íntegramente a la Cuenta
    Individual de Capitalización (CIC) del afiliado^30. Este concepto está fijado por ley nacional
    en el **10.00%** de la remuneración asegurable bruta mensual y es idéntico e inmutable
    para las cuatro administradoras privadas^30.
2. **Prima de Seguro de Invalidez, Sobrevivencia y Gastos de Sepelio:** Corresponde a un
    seguro colectivo previsional contratado de forma conjunta por el sistema^27. La tasa de
    este seguro se determina mediante un proceso de licitación internacional coordinado de
    forma bienal por la SBS^31. La vigencia de la licitación actual establece una tasa uniforme
    del **1.37%** para el período bajo estudio^31.
3. **Comisión por Administración de Fondos de la AFP:** Corresponde al pago que el
    afiliado realiza directamente a la administradora para compensar los servicios operativos
    y de inversión de su fondo^28. Este elemento **varía obligatoriamente según la AFP en la**
    **que esté inscrito el trabajador**^27.
Para el cálculo de las retenciones en la boleta de pago del trabajador, coexisten dos esquemas


de cobro de comisión que modifican la retención final en nómina^28 :

#### Esquema de Comisión por Flujo

Este esquema tradicional aplica exclusivamente a los trabajadores que se afiliaron al sistema
antes de 2013 y manifestaron explícitamente su voluntad de no migrar al esquema de comisión
mixta^31. En esta modalidad, la comisión se calcula de forma directa como un porcentaje de la

remuneración asegurable del mes en curso, reteniéndose de su sueldo bruto^31.

[cite: 32, 35]

#### Esquema de Comisión Mixta (o sobre el Saldo)

Vigente de forma predeterminada para todos los trabajadores afiliados a partir del año 201331.
Conforme al reglamento de la SBS para la culminación del período de transición transitorio de
la comisión mixta, el componente porcentual sobre el sueldo (flujo) se redujo progresivamente
hasta fijarse en **0.00%** de manera obligatoria a partir del mes de devengue de febrero de
202327.
Por lo tanto, la AFP cobra actualmente su comisión de forma anual y directa sobre el saldo
acumulado en la cuenta de pensiones del afiliado (lo cual no afecta de forma directa al flujo de
su nómina)^31. La retención mensual directa que el empleador debe realizar de la boleta del
trabajador bajo Comisión Mixta es uniforme e independiente de la administradora de fondos^32 :

[cite: 32, 36]

### Validación de la hipótesis del code review y tasas por administradora

La revisión del código ( _code review_ ) que sostiene que la tasa real está acotada entre un **11.37%
y un 13.06%** es **técnicamente exacta y de una precisión legal intachable**. El valor estático
de 11.2% carece de fundamento normativo.
Si el afiliado cotiza bajo el régimen generalizado de Comisión Mixta, el descuento neto mensual
sobre su nómina es siempre del **11.37%**^32. En cambio, si el afiliado cotiza en el esquema

histórico de Comisión por Flujo, la retención final varía dependiendo de su AFP^32. La tabla a
continuación desglosa de manera exhaustiva las tasas vigentes para el año 2025 y el año 2026
en el sistema previsional peruano:

```
Administra
dora de
Fondos
(AFP)
```
```
Aporte
Obligatorio
(CIC)
```
```
Prima de
Seguro
(Licitación
SBS)
```
```
Comisión
Flujo
(Sueldo)
```
```
Retención
Total en
Esquema
Flujo
```
```
Comisión
Anual
sobre
Saldo*
```

##### AFP

```
Habitat
```
##### 10.00%^32 1.37%^32 1.47%^32 12.84%^

```
[cite: 32, 35]
```
##### 1.25%^32

##### AFP

```
Integra
```
##### 10.00%^32 1.37%^32 1.55%^32 12.92%^

```
[cite: 32, 35]
```
##### 0.78%^32

**AFP Prima** (^) 10.00%^32 1.37%^32 1.60%^32 **12.97%**
[cite: 32, 35]

##### 1.25%^32

##### AFP

```
Profuturo
```
##### 10.00%^32 1.37%^32 1.69%^32 13.06%^

```
[cite: 32, 35]
```
##### 0.68%^30

*Nota: El porcentaje de comisión anual sobre el saldo no es objeto de retención directa por
nómina del empleador. Se deduce directamente por la administradora de la rentabilidad anual
acumulada en el fondo del trabajador, por lo que su modelado mensual directo en el sueldo
neto neto debe fijarse en 0.00%^31.
La fuente oficial definitiva y vinculante que respalda la correcta aplicación de estas tasas es la
plataforma de la **Superintendencia de Banca, Seguros y AFP (SBS)** a través de su reporte de
comisiones y primas de seguro de invalidez y sobrevivencia del SPP^32.

### La Remuneración Máxima Asegurable (RMA)

Para lograr un software de nivel profesional que no genere discrepancias con los cálculos
reales de los sistemas corporativos, la lógica del archivo
packages/core/src/settlement/pe/calculate.ts debe incorporar de forma estricta el concepto de
**Remuneración Máxima Asegurable (RMA)**^31.
La SBS establece periódicamente de manera trimestral un límite de sueldo tope sobre el cual se
calcula la prima de seguro del 1.37%^31. Cualquier cantidad que un trabajador perciba que
supere dicho tope mensual está exenta de la retención del seguro por concepto de invalidez y
sobrevivencia sobre la porción excedente^31. Por ejemplo, para el trimestre correspondiente a
los meses de abril, mayo y junio de 2026, la RMA oficial está fijada en **S/ 12,598.91**^30.
Por consiguiente, si un trabajador percibe una remuneración mensual de S/ 15,000.00, la lógica
de cálculo debe bifurcarse del siguiente modo:
● **Cálculo del Aporte Obligatorio (10%):** Se aplica sobre el total de los ingresos afectos
mensuales sin límite previsional:

```
● Cálculo de la Prima de Seguro (1.37%): Se aplica únicamente sobre el tope
determinado por la RMA vigente, protegiendo al empleado de descuentos indebidos en
exceso^31 :
```

Un algoritmo que no incluya la RMA calcularía erróneamente un seguro de S/ 205.50 para este
trabajador, generando inconsistencias graves en las hojas de liquidación y en las declaraciones
de planilla electrónica (PLAME) que procesa el área de administración de recursos humanos de
las empresas en Perú.

## 3. Resumen normativo de fuentes de consulta y

## auditoría

Para facilitar la trazabilidad del código y auditorías de datos, se consolidan las referencias
legales, vigencias actuales y fuentes de auditoría requeridas para configurar y mantener las
bases de datos de la calculadora con absoluta seguridad jurídica:

```
Tema de
Configuración
```
```
Base de
Verificación
Legal
```
```
Vigencia
Operativa de
Datos
```
```
Fuente Oficial
y Confianza
```
```
URL de
Auditoría
Técnica
```
```
Salario
Mínimo
México
```
```
Resoluciones
del H. Consejo
de la
CONASAMI en
Diario Oficial
(DOF)^1
```
```
1 de enero al 31
de diciembre
de cada año^3
```
##### CONASAMI

```
(Oficial)^2
```
```
https://www.go
b.mx/conasami
/documentos/t
abla-de-salario
s-minimos-gen
erales-y-profe
sionales-por-a
reas-geografic
as
[cite: 2]
```
```
Salario
Mínimo El
Salvador
```
```
Decretos
Ejecutivos del
CNSM
publicados en
el Diario
Oficial^7
```
```
Indefinido
(Hasta la
emisión de un
nuevo decreto
de
actualización)^10
```
```
MTPS (Oficial)^7 https://www.mt
ps.gob.sv/desc
argas/
[cite: 14]
```
```
Salario
Mínimo
```
```
Decretos
Presidenciales
del Ministerio
```
```
1 de enero al 31
de diciembre
```
##### MINTRABAJO

```
(Oficial)^20
```
```
https://www.fu
ncionpublica.g
ov.co/eva/gest
```

**Colombia** (^) del Trabajo^15 de cada año^20 ornormativo/
[cite: 21, 25]
**Tasas
Previsionales
Perú**
Compendio de
Normas del
SPP e Informes
Mensuales de
Comisiones y
Primas^27
Mensual (Las
tasas de
comisiones
cambian por
licitación u
oferta de la
SBS)^29
**Superintende
ncia de Banca,
Seguros y AFP
(SBS)**
(Oficial)^32
https://www.sb
s.gob.pe/app/s
pp/empleadore
s/comisiones_s
pp/paginas/co
mision_prima.a
spx
[cite: 32, 34]
Esta unificación estructural dota al proyecto Justo de la flexibilidad lógica y robustez legal
indispensables para convertirse en una calculadora laboral de referencia regional, protegiendo
tanto los derechos de los trabajadores como el cumplimiento patronal a través de cálculos
matemáticos respaldados rigurosamente por las leyes locales.

#### Fuentes citadas

#### 1. Salarios Mínimos Generales y Profesionales 2025 - AMCP - Asociación Mexicana

#### de Contadores Públicos,

#### https://amcpdf.org.mx/salarios-minimos-generales-y-profesionales-2025/

#### 2. Tablas de Salarios Mínimos Generales y Profesionales - Gob MX,

#### https://www.gob.mx/conasami/documentos/tabla-de-salarios-minimos-generales

#### -y-profesionales-por-areas-geograficas

#### 3. Salarios mínimos generales - CEFA, https://www.cefa.com.mx/salarios.php

#### 4. (http://www.gob.mx) > Comisión Nacional de los Salarios Mínimos (/conasami) >

#### Blog,

#### https://www.datacomp.com.mx/upload/pdf/-06-12-2024-salarios-minimos-2025-

#### conasami.pdf

#### 5. Salarios Mínimos Histórico 1988 - 2026 - Contaduría CCii,

#### https://contaduriaccii.com.mx/salarios-minimos-historico/

#### 6. $408.80 sería nuevo salario mínimo en industria y servicio, tras incremento del

#### 12% anunciado por el presidente Nayib Bukele.,

#### https://www.mtps.gob.sv/2025/04/25/408-80-seria-nuevo-salario-minimo-en-ind

#### ustria-y-servicio-tras-incremento-del-12-anunciado-por-el-presidente-nayib-bu

#### kele/

#### 7. Leyes sobre el salario mínimo en El Salvador | 2025 - Jibble,

#### https://www.jibble.io/es/legislacion-laboral/el-salvador/salario-minimo

#### 8. Miranda Corporation-Salarios Mínimos El Salvador 2025: Tarifas por Sector,

#### https://www.mirandacorporation.com/salarios-minimos-el-salvador-2025-tarifas-

#### por-sector/

#### 9. Incremento al salario mínimo en junio 2025: implicaciones contables y fiscales

#### clave,

#### https://www.contaportable.com/incremento-al-salario-minimo-en-junio-2025-im


#### plicaciones-contables-y-fiscales-clave/

#### 10. Salario Mínimo El Salvador 2026: Tabla Oficial por Sector, Cálculo Diario y Lo Que

#### Realmente Recibís en Tu Cuenta,

#### https://finiquitojusto.com/derechos-laborales/salario-minimo-el-salvador/

#### 11. Decreto N° 11 – Tarifas de Salarios Mínimos en El Salvador 2025 (PDF) -

#### Interbiznet,

#### https://interbiznet.net/wp-content/uploads/2025/05/Decreto-N%C2%B0-11-Tarifa

#### s-de-Salarios-Minimos-en-El-Salvador-2025.pdf

#### 12. Salvadoreños esperan cambio de salario mínimo - Noticias Prensa Latina,

#### https://www.prensa-latina.cu/2024/04/12/salvadorenos-esperan-cambio-de-salar

#### io-minimo/

#### 13. El Gobierno de El Salvador propone incrementar el salario mínimo un 20%,

#### https://forbescentroamerica.com/2021/07/01/el-gobierno-de-el-salvador-propon

#### e-incrementar-el-salario-minimo-un-

#### 14. Descargas - Ministerio de Trabajo y Previsión Social,

#### https://www.mtps.gob.sv/descargas/

#### 15. El salario mínimo para 2025 aumentó en 9,5% y quedará en $1'423.500,

#### https://www.presidencia.gov.co/prensa/Paginas/El-salario-minimo-para-2025-au

#### mentara-el-9-54-porciento-y-queda-en-1423500-presidente-Gustavo-Petro-

#### 1224.aspx

#### 16. decreto 1724 del 15 de diciembre de 2021 - DAPRE,

#### https://dapre.presidencia.gov.co/normativa/normativa/DECRETO%201724%20DEL

#### %2015%20DE%20DICIEMBRE%20DE%202021.pdf

#### 17. ¿Cuánto cuesta un empleado con salario mínimo en 2025 en Colombia? - Enlace

#### Operativo, https://enlace.com.co/blog/costo-empleado-salario-minimo-

#### 18. Decreto 1573 de 2024 - Gestor Normativo - Función Pública,

#### https://www.ins.gov.co/Normatividad/Decretos/DECRETO%201573%20DE%

#### 4.pdf

#### 19. Auxilio de transporte en Colombia - Actualícese,

#### https://actualicese.com/auxilio-de-transporte/

#### 20. Salario mínimo y auxilio de transporte históricos en Colombia - Consultor

#### Contable,

#### https://www.consultorcontable.com/datos-hist%C3%B3ricos/salario-m%C3%ADn

#### imo-historico/

#### 21. Decreto 1785 de 2020 - Gestor Normativo - Función Pública,

#### https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=

#### 22. Salario mínimo en Colombia: Aumento anual y legislación - Actualícese,

#### https://actualicese.com/salario-minimo/

#### 23. Decreto 1724 de 2021 - Gestor Normativo - Función Pública,

#### https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=

#### 24. Flash News - Actualización del salario mínimo en Colombia - J.A. Del Río,

#### https://www.jadelrio.com/co/es/blogs/flash-news-actualizacion-del-salario-minim

#### o-en-colombia

#### 25. Decreto 1572 de 2024 - Gestor Normativo - Función Pública,

#### https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=


#### 26. Salario mínimo en Colombia 2025: ¿En cuánto quedó y cómo te afecta? - Treinta,

#### https://treinta.co/blog/salario-minimo-en-colombia-

#### 27. Todo sobre las comisiones - Asociación de AFP,

#### https://www.asociacionafp.pe/sistema-privado-pensiones/todo-sobre-las-comisi

#### ones/

#### 28. Comisiones y primas - SBS,

#### https://www.sbs.gob.pe/usuarios/aprende-con-la-sbs/comisiones-y-primas

#### 29. AFP - Peru, https://supportcenter.buk.pe/hc/es-419/articles/36275507011995-AFP

#### 30. Aportes y Primas - Profuturo AFP,

#### https://enlinea.profuturo.com.pe/zonaprivadaext/aportes_primas

#### 31. ¿Cuánto te cobra tu AFP? Descuentos, comisiones y seguro,

#### https://www.afphabitat.com.pe/aprende-de-prevision/cuanto-te-cobra-tu-afp-d

#### escuentos-comisiones-y-seguro/

#### 32. comisión anual sobre saldo - SBS,

#### https://www.sbs.gob.pe/app/spp/empleadores/comisiones_spp/paginas/comision

#### _prima.aspx

#### 33. Invalidez y Sobrevivencia - Habitat Perú,

#### https://www.afphabitat.com.pe/seguro-de-invalidez-sobrevivencia-y-gastos-de-

#### sepelio/

#### 34. Prima de Seguro AFP 2026 - misha, https://misha.pe/laboral/prima-seguro-afp/

#### 35. Cobramos 0% de comisión sobre tu sueldo en comisión mixta - AFP Integra,

#### https://www.afpintegra.pe/cliente/comisiones

#### 36. Folleto Comparativo AFP vs ONP,

#### https://cdn.aglty.io/scotiabank-peru/1-profuturo-websites-assets/empresa/afiliaci

#### ones/Folleto_AFPvsONP.pdf

#### 37. Confianza con bienestar financiero - Profuturo AFP,

#### https://www.profuturo.com.pe/Personas/novedades/descubre/confianza-profutur

#### o/confianza-financiera


