export type Product = {
    id: number;
    name?: string;
    category?: string;
    price: string;
    image: string;
    badge?: string;
    description?: string;
    details?: string;
};

/*export const products = [
    // ================= RELÓGIOS =================
    {
        id: 1,
        name: "Relógio Executive Gold",
        category: "Relógios",
        price: "32.500 CVE",
        badge: "Mais vendido",
        image: "/images/products/relogio_silver_gold.avif",
        description: "Relógio elegante com acabamento premium.",
        details: "Design sofisticado, ideal para ocasiões formais e uso diário com estilo.",
    },
    {
        id: 2,
        name: "Relógio Silver Classic",
        category: "Relógios",
        price: "21.900 CVE",
        badge: "Popular",
        image: "/images/products/relogio_silver_classic.avif",
        description: "Modelo clássico e versátil.",
        details: "Perfeito para qualquer ocasião, combinando elegância e simplicidade.",
    },
    {
        id: 3,
        name: "Relógio Black Edition",
        category: "Relógios",
        price: "27.000 CVE",
        badge: "Novo",
        image: "/images/products/relogio_black_edition.avif",
        description: "Visual moderno e marcante.",
        details: "Ideal para quem quer destacar personalidade e estilo urbano.",
    },
    {
        id: 4,
        name: "Relógio Luxury Steel",
        category: "Relógios",
        price: "35.800 CVE",
        badge: "Mais vendido",
        image: "/images/products/relogio_luxury_steel.avif",
        description: "Alta resistência e elegância.",
        details: "Construído com materiais premium para máxima durabilidade.",
    },
    {
        id: 5,
        name: "Relógio Urban Fit",
        category: "Relógios",
        price: "18.400 CVE",
        badge: "Popular",
        image: "/images/products/relogio_urban_fit.avif",
        description: "Leve e confortável.",
        details: "Ideal para uso diário com conforto e estilo minimalista.",
    },

    // ================= JOIAS =================
    {
        id: 6,
        name: "Brincos Diamond Shine",
        category: "Joias",
        price: "14.900 CVE",
        badge: "Mais vendido",
        image: "/images/products/joia_colar_diamond_shine.avif",
        description: "Brincos elegante com brilho intenso.",
        details: "Peça perfeita para ocasiões especiais e presentes.",
    },
    {
        id: 7,
        name: "Colar Golden Touch",
        category: "Joias",
        price: "8.700 CVE",
        badge: "Popular",
        image: "/images/products/joia_brincos_golden_touch.avif",
        description: "Delicados e sofisticados.",
        details: "Ideal para uso diário com um toque de luxo.",
    },
    {
        id: 8,
        name: "Colar Luxe Gold",
        category: "Joias",
        price: "11.500 CVE",
        badge: "Novo",
        image: "/images/products/joia_pulseira_luxe_gold.avif",
        description: "Ccolar moderna e elegante.",
        details: "Combina com qualquer look sofisticado.",
    },
    {
        id: 9,
        name: "Anel Royal Queen",
        category: "Joias",
        price: "16.200 CVE",
        badge: "Mais vendido",
        image: "/images/products/joia_anel_royal_queen.avif",
        description: "Anel com design marcante.",
        details: "Perfeito para destacar elegância e poder.",
    },
    {
        id: 10,
        name: "Conjunto Glam Set",
        category: "Joias",
        price: "19.900 CVE",
        badge: "Popular",
        image: "/images/products/joia_mini_pingente_cabochao.avif",
        description: "Conjunto completo de joias.",
        details: "Ideal para eventos e ocasiões especiais.",
    },

    // ================= ROUPAS & ACESSÓRIOS =================
    {
        id: 11,
        name: "Vestido Elegant Fashion",
        category: "Roupas & Acessórios",
        price: "14.900 CVE",
        badge: "Mais vendido",
        image: "/images/products/r&a_vestido_elegant_fashion.avif",
        description: "Vestido sofisticado.",
        details: "Ideal para eventos formais e ocasiões especiais.",
    },
    {
        id: 12,
        name: "Bolsa Urban Chic",
        category: "Roupas & Acessórios",
        price: "12.600 CVE",
        badge: "Popular",
        image: "/images/products/r&a_bolsa_urban_chi.avif",
        description: "Bolsa moderna.",
        details: "Combina com looks casuais e elegantes.",
    },
    {
        id: 13,
        name: "Óculos Fashion Luxe",
        category: "Roupas & Acessórios",
        price: "9.200 CVE",
        badge: "Novo",
        image: "/images/products/r&a_oculos_fashion_luxe.avif",
        description: "Óculos com design moderno.",
        details: "Perfeito para destacar o estilo.",
    },
    {
        id: 14,
        name: "Jaqueta Premium Style",
        category: "Roupas & Acessórios",
        price: "22.000 CVE",
        badge: "Mais vendido",
        image: "/images/products/r&a_jaqueta_premium_style.avif",
        description: "Jaqueta elegante.",
        details: "Ideal para clima urbano com estilo.",
    },
    {
        id: 15,
        name: "Sapato Classic Men",
        category: "Roupas & Acessórios",
        price: "18.300 CVE",
        badge: "Popular",
        image: "/images/products/r&a_sapato_classic_men.avif",
        description: "Sapato clássico.",
        details: "Conforto e elegância no dia a dia.",
    },

    // ================= CABELOS HUMANOS =================
    {
        id: 16,
        name: "Lace Wig Premium",
        category: "Cabelos Humanos",
        price: "28.900 CVE",
        badge: "Mais vendido",
        image: "/images/products/cabelo_lace_wig_premium.avif",
        description: "Cabelo natural premium.",
        details: "Visual natural e acabamento perfeito.",
    },
    {
        id: 17,
        name: "Wig Natural Silk",
        category: "Cabelos Humanos",
        price: "31.500 CVE",
        badge: "Popular",
        image: "/images/products/cabelo_wig_natural_silk.avif",
        description: "Textura suave.",
        details: "Ideal para uso prolongado com conforto.",
    },
    {
        id: 18,
        name: "Hair Extension Deluxe",
        category: "Cabelos Humanos",
        price: "19.800 CVE",
        badge: "Novo",
        image: "/images/products/cabelo_hair_extension_deluxe.avif",
        description: "Extensões naturais.",
        details: "Volume e comprimento com acabamento profissional.",
    },
    {
        id: 19,
        name: "Wig Luxury Volume",
        category: "Cabelos Humanos",
        price: "35.000 CVE",
        badge: "Mais vendido",
        image: "/images/products/cabelo_wig_luxure_volume.avif",
        description: "Volume e brilho.",
        details: "Ideal para looks sofisticados.",
    },
    {
        id: 20,
        name: "Hair Premium Straight",
        category: "Cabelos Humanos",
        price: "26.700 CVE",
        badge: "Popular",
        image: "/images/products/cabelo_premium_straigth.avif",
        description: "Cabelo liso premium.",
        details: "Elegância e naturalidade para qualquer ocasião.",
    },
    {
        id: 21,
        name: "Relógio Breitling Classic",
        category: "Relógios",
        price: "32.500 CVE",
        badge: "Mais vendido",
        image:
            "/images/products/relogio_breitling_classic_avi.avif",
        description:
            "Relógio elegante com acabamento premium.",
        details:
            "Um relógio sofisticado, ideal para uso diário e ocasiões especiais. Combina design moderno, presença marcante e acabamento de alto nível.",
    },
    {
        id: 22,
        name: "Lace Frontal Wig",
        category: "Cabelos Humanos",
        price: "28.900 CVE",
        badge: "Novo",
        image:
            "/images/products/cabelo_lace_frontal_wig.avif",
        description:
            "Cabelo humano premium com acabamento natural.",
        details:
            "Produto de qualidade premium, com visual natural, toque macio e excelente caimento. Ideal para clientes que procuram elegância e confiança.",
    },
    {
        id: 23,
        name: "Conjunto Shine Luxury",
        category: "Joias",
        price: "18.750 CVE",
        badge: "Oferta",
        image: "/images/products/joia_conjunto_shine_luxury.avif",
        description:
            "Conjunto de joias delicado e sofisticado.",
        details:
            "Uma peça luxuosa pensada para realçar beleza e requinte. Ideal para presentes, eventos especiais e clientes que valorizam detalhe.",
    },
    {
        id: 24,
        name: "Mochila Young Fashion",
        category: "Roupas & Acessórios",
        price: "12.600 CVE",
        badge: "Popular",
        image:
            "/images/products/r&a_mochila_young_fashion.avif",
        description:
            "Bolsa moderna e versátil para o dia a dia.",
        details:
            "Bolsa com visual contemporâneo, prática e elegante. Perfeita para complementar looks casuais e sofisticados.",
    },
];*/