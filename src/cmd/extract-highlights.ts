import { extractHighlightsFromContent } from "@/triggers/process-pdf/extract-highlights";

extractHighlightsFromContent([
	{
		content:
			"# ING\n\n## Esta es la simulación de tu hipoteca\n\nTu hipoteca NARANJA de 270. 000 € a 28 años para una primera vivienda en LAS PALMAS. Precio de la vivienda 393. 750 €\n\nCuánto dinero solicitas 270. 000 €\n\nEn cuánto tiempo quieres devolverlo 28 años\n\nEn total, necesitas tener ahorrado: 152. 373 €\n\nAhorro aportado: 123. 750 €\n\nImpuestos y gastos: 28. 623 €\n\n|  Impuestos |   |\n| --- | --- |\n|  Actos Jurídicos Documentados | 0 €  |\n|  Transmisiones | 25. 594 €  |\n|  Gastos | Compraventa  |\n|  Notaría | 1. 532 €  |\n|  Registro | 646 €  |\n|  Gestoría | 391 €  |\n|  Tasación | 0 €  |\n\n## Contrata tu Hipoteca NARANJA como quieras:\n\n- En **ing. es**. Simula y sigue el proceso. ### Por teléfono\n\n- Si ya eres cliente: 91 206 66 66. - Si todavía no lo eres: 91 206 66 55. ### En tu oficina más cercana. Encuéntrala en el buscador de tu app o en la web. En 5 minutos sabrás si tu hipoteca es en principio viable, y un gestor personal te acompañará durante todo el proceso hasta la firma.",
		pageIndex: 0,
	},
	{
		content:
			"# Hipoteca NARANJA Fija \n\n## Plazo fijo 28 años\n\n## Nómina + Seguros de hogar y vida\n\nCon la tranquilidad de pagar siempre lo mismo\n$1. 308,63 € /$ mes\nDurante toda la vida de la hipoteca\n\nTIN: 3,2 \\%\nTAE: 3,6 \\%\n\n## Nómina + Seguro de hogar\n\nCon la tranquilidad de pagar siempre lo mismo\n$1. 351,68 € /$ mes\nDurante toda la vida de la hipoteca\n\nTIN: 3,5 \\%\nTAE: 3,71 \\%\n\n## Sin productos combinados\n\nCon la tranquilidad de pagar siempre lo mismo\n$1.",
		pageIndex: 1,
	},
	{
		content:
			"# Hipoteca NARANJA Fija \n\nLo que te explicamos a continuación es esa letra pequeña que suele haber en los contratos, pero que casi nadie lee. Sin embargo, es importante, y por eso en ING la hemos hecho más clara. Bueno, y si aun así te quedan dudas, contacta con nosotros. ## Información sobre las ofertas:\n\nPara concederte el préstamo hipotecario, antes tenemos que autorizarlo. El importe que concedemos para la Hipoteca NARANJA es: Como mínimo 50. 000 € y como máximo: hasta el $80 \\%$ del valor de tasación del inmueble a hipotecar, que tendrá que reunir las condiciones de habitabilidad que desde ING establezcamos para una operación de compra o subrogación de primera vivienda. Este porcentaje máximo puede ser menor en función de la finalidad del préstamo y del inmueble. Para la compra o subrogación de una segunda vivienda se aplicará un $75 \\%$ para clientes de ING y un $65 \\%$ para no clientes. Para otras finalidades se aplicará entre un $65 \\%$ y un $80 \\%$ dependiendo de la finalidad.",
		pageIndex: 2,
	},
	{
		content:
			"La Hipoteca NARANJA Variable ofrece estos plazos para pagar el préstamo: Plazo mínimo 9 años y plazo máximo 40 años. La Hipoteca NARANJA Mixta ofrece estos plazos para pagar el préstamo: Mixta 5 años fijos: Plazo mínimo 9 años y plazo máximo 40 años. Mixta 10 años fijos: Plazo mínimo 11 años y plazo máximo 40 años. Mixta 15 años fijos: Plazo mínimo 16 años y plazo máximo 40 años. Mixta 20 años fijos: Plazo mínimo 21 años y plazo máximo 40 años. La Hipoteca NARANJA Fija ofrece 25 años de plazo para pagar el préstamo. Además para la adquisición de tu primera vivienda, si tienes menos de 36 años, la vivienda que vas a adquirir no supera los 400. 000€ y si solicitas más del $80 \\%$, hasta el $100 \\%$ del valor de tasación (no pudiendo superar el $100 \\%$ del valor de compra), en cualquiera de nuestras hipotecas NARANJA el plazo máximo será de 30 años para la Variable y Mixta y un plazo único de 25 años para la Fija. ## Hipoteca NARANJA fija: 28 años fijos\n\n## *1 al 3.",
		pageIndex: 2,
	},
	{
		content:
			"Cuánto te costará la hipoteca fija\n\nLa TAE incluye el importe de la tasación correspondiente. Para un ejemplo representativo de una hipoteca de 150. 000 €, dicho importe se ha estimado en 363 € (impuestos incluidos). Para el caso de una simulación personalizada, el importe tenido en cuenta es el reflejado en el detalle de impuestos y gastos de tu simulación (impuestos incluidos). Al amortizar anticipadamente tu Hipoteca NARANJA Fija se te podrá aplicar una comisión, pero solo si ING sufre una pérdida financiera. Esta comisión nunca superará el $2 \\%$ del capital amortizado si haces el reembolso durante los primeros 10 años de tu hipoteca o el $1,5 \\%$ si es desde ese momento hasta su finalización. ## Ten en cuenta que estos ejemplos están calculados para un supuesto de una primera vivienda. Partimos de este supuesto para todos los ejemplos representativos: Préstamo: $\\mathbf{3 2 0 . 0 0 0 , 0 0}$. Duración: $\\mathbf{3 5}$ años. № de cuotas: 420.",
		pageIndex: 2,
	},
	{
		content:
			"Los datos indicados a continuación son orientativos y corresponden a las variables indicadas en el ejemplo representativo, el cual no constituye una oferta de contratación. Para concederte el préstamo hipotecario, antes tenemos que autorizarlo. ## *1 Ejemplo de TAE Variable de 3,6 \\%. TIN 3,2\\%. Fija, con NÓMINA y Seguros de hogar y vida. Este supuesto, en la Hipoteca NARANJA Fija, requiere que cumplas las siguientes condiciones: 1. Tener una Cuenta en ING en la cual: hayas domiciliado tu nómina o ingreses 600 € o más cada mes, o tengas un saldo diario mínimo de 2000 €. 2. Hayas contratado este/estos seguro/s comercializados por ING: Seguro de Hogar: HogarSeguro: Coste 225,02 € / año. Cobertura: 95. 000 € de continente. 15. 000 € de contenido (El importe puede variar en función de las coberturas que contrates). Seguro de Vida: Seguro de Vida Hipoteca: Coste 28,09 € / mes.",
		pageIndex: 2,
	},
	{
		content:
			"El importe es un ejemplo orientativo para un titular de 30 años de edad y podrá variar según la edad del cliente y el capital pendiente. Cuánto te costará la hipoteca en este ejemplo: TAE: 3,6\\%. Cuota mensual: 1. 308,63 € Total a pagar: 407. 101,3 € Coste total: 137. 101,3 € Intereses totales: 122. 589 €\n\n## *2 Ejemplo de TAE Variable de 3,71 \\%. TIN 3,5\\%. Fija, con NÓMINA y Seguros de hogar. Este supuesto, en la Hipoteca NARANJA Fija, requiere que cumplas las siguientes condiciones: 1. Tener una Cuenta en ING en la cual: hayas domiciliado tu nómina o ingreses 600 € o más cada mes, o tengas un saldo diario mínimo de 2000 €. 2. Hayas contratado este/estos seguro/s comercializados por ING: Seguro de Hogar: HogarSeguro: Coste 225,02 € / año. Cobertura: 95. 000 € de continente. 15. 000 € de contenido (El importe puede variar en función de las coberturas que contrates). Seguro de Vida: Seguro de Vida Hipoteca: Coste 28,09 € / mes.",
		pageIndex: 2,
	},
	{
		content:
			"El importe es un ejemplo orientativo para un titular de 30 años de edad y podrá variar según la edad del cliente y el capital pendiente. Cuánto te costará la hipoteca en este ejemplo: TAE: 3,71\\%. Cuota mensual: 1. 351,68 € Total a pagar: 411. 589,3 € Coste total: 141. 589,3 € Intereses totales: 135. 504 €\n\n## *3 Ejemplo de TAE Variable de 3,68 \\%. TIN 3,6\\%. Fija, sin contratar productos combinados. Para este supuesto de la Hipoteca NARANJA Fija, solo será necesaria la apertura de una cuenta, totalmente gratis, para realizar el pago de la hipoteca. Cuánto te costará la hipoteca en este ejemplo: TAE: 3,68\\%. Cuota mensual: 1. 366,21 € Total a pagar: 410. 322,8 € Coste total: 140. 322,8 € Intereses totales: 139.",
		pageIndex: 2,
	},
	{
		content:
			"# *4 Gastos (registro + notaria + gestoría + tasación + IAJD \n\nFormalizar el préstamo hipotecario genera gastos de tasación, registro, notaría y gestoría. Desde ING pagaremos esos gastos, excepto el de tasación. Nosotros pagaremos, igualmente, el Impuesto sobre Actos Jurídicos Documentados (IAJD), excepto en el País Vasco\n\n## Sistema de amortización\n\nLas Hipotecas NARANJA siguen el sistema de amortización francés. Este sistema de amortización se caracteriza por tener cuotas constantes y por que el cliente paga los intereses según el capital que queda pendiente de amortizar. Por ello, durante los primeros años de la hipoteca vas a pagar una cantidad mayor de intereses que de capital, y durante el período final del préstamo pagarás más capital y menos intereses. Ten en cuenta que si tu préstamo tiene un período de tipo de interés variable, las cuotas podrán variar con las revisiones semestrales de tipo de interés durante ese período.",
		pageIndex: 3,
	},
	{
		content:
			"Para calcular las cuotas mensuales que tendrás que pagar, utilizamos esta fórmula:\n$a=\\left(C^{2} * i\\right) *(1-(1+i)-n)-1$\n«a» es la cuota. «Co» es el importe pendiente del préstamo hipotecario. «i» es el tipo de interés anual dividido por 12. «n» es el número de meses pendientes. Durante el período en el que el tipo de interés del préstamo hipotecario es fijo, calculamos las cuotas de acuerdo con ese tipo de interés fijo. Para calcular los intereses según el capital que queda pendiente de amortizar, utilizamos esta fórmula:\n$I(p-1, p)=I * C(p-1)$\n«I(p-1, p)» son los intereses. «i» es el tipo de interés anual dividido por 12. «C(p-1)» es el capital del préstamo hipotecario pendiente de amortizar. Información adicional: ING BANK NV, Sucursal en España, es un operador de banca-seguros vinculado de Nationale- Nederlanden Vida, Compañía de Seguros y Reaseguros SAE, y de Nationale-Nederlanden Generales, Compañía de Seguros y Reaseguros SAE.",
		pageIndex: 3,
	},
	{
		content:
			"Está inscrito en el Registro Administrativo Especial de Mediadores de Seguros en los Países Bajos con el número 12000059 con seguro de responsabilidad civil y habilitado para ejercer en España en calidad de sucursal de una entidad de la U. E. Consulta las compañías aseguradoras con las que ING Bank NV, Sucursal en España ha celebrado contratos de agencia, así como más información, en nuestra política sobre la actividad de comercialización de seguros, en la sección de 'Info legal/información legal de seguros' de ing. es. Por otro lado, puedes consultar y ampliar información en la Ficha de Información Precontractual de nuestras hipotecas que está en la sección de Información Legal de la página web de ING (ing. es).",
		pageIndex: 3,
	},
])
	.then(console.log)
	.catch(console.error);
