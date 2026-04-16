export type Category = 'All' | 'Sofas' | 'Loveseats' | 'Chairs' | 'Benches' | 'Ottomans'

export interface Product {
  name: string
  category: Category | string
  image: string
}

export const CATEGORIES: Category[] = ['All', 'Sofas', 'Loveseats', 'Chairs', 'Benches', 'Ottomans']

export const INVENTORY: Product[] = [
  // Sofas
  { name: 'INDIWIN SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393201962-4E4HKZNINTLTPTQE7Z8O/INDIWIN_Sofa_0.png' },
  { name: 'BROOKLYN SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393192804-GCYSRGVJ8BJOCF3G6AKM/BROOKLYN_Sofa_0.png' },
  { name: 'STANHOPE SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674246744572-OWQALDPC7UF01CB3TM98/STANHOPE+Sofa.png' },
  { name: 'SYLVANUS SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1636058750911-1JRVRUJZ46B0XLBQOUFS/SYLVANUS+Sofa+0.png' },
  { name: 'SILAS CANE SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1650311158276-CAYBN7BTVUKPJ65QGQ8P/SILAS+Cane+Sofa+0.png' },
  { name: 'HENRY SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/9f9ccadd-8ec1-4113-aa09-8d1220e5ea48/HENRY+Sofa+0.png' },
  { name: 'LINDT SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393204231-W79P4V24URXTZREUL8H6/LINDT_Sofa_0.png' },
  { name: 'RESHMA BOTANICAL SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/5166c92a-373f-4fb8-ba20-74feed2e95ef/RESHMA+Botanical+Sofa+0.png' },
  { name: 'AVIANA LINEN SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/2fb4d229-116b-4439-a127-c0c64c95d3e8/AVIANA+Linen+Sofa+0.png' },
  { name: 'GWENEVERE DAYBED', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393266272-VZKU6C4S9WI7LNC14A75/GWENEVERE_Daybed_0.png' },
  { name: 'ELIZABETH SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/9da8dac2-d0b4-442a-9731-d7a8ef9af204/ELIZABETH+Sofa+0.png' },
  { name: 'CALISTA FRINGE SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/b0b6364a-c683-4a5c-93f2-26ca4e1a1d85/CALISTA+Fringe+Sofa+0.png' },
  { name: 'ROSALIND DONUT SECTIONAL', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/2f90aa29-7724-4b57-81c6-500b8e6dc35d/ROSALIND+Donut+Sectional.png' },
  { name: 'ERIN FRENCH SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1642724211971-EQ891G6HN5GM6MOGZ18W/ERIN+French+Sofa.png' },
  { name: 'SIDONY SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674675848145-7SCTYSZ3AJ6Z6A987MZZ/SIDONY+Sofa+0.png' },
  { name: 'TALON SOFA', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393210705-JO0E30UY5SYVT0UISJBN/TALON_Sofa_0.png' },
  { name: 'LAGOS', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/3f087437-7f6d-4234-9bd0-ed45bd9a9254/LAGOS+0.png' },
  { name: 'FULTON', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/11b30ad1-48f5-4a7d-8883-40f69109bc7b/FULTON+0.png' },
  
  // Loveseats
  { name: 'COSETTE LOVESEAT', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c8ac9355-3736-43f6-bfc5-c64ca7adc3cf/COSETTE+Loveseat+0.png' },
  { name: 'PHILLIPE LOVESEAT', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c2465c76-e9a5-42e4-a40a-b678f315eb04/PHILLIPE+Loveseat+0.png' },
  { name: 'ANTONELLA LOVESEAT', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676671956492-JY9LKWXFNL9DDQAQO719/ANTONELLA+Loveseat+0.png' },
  { name: 'COMMODORE LOVESEAT', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png' },
  { name: 'JACINDA LOVESEAT', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c94dd17d-0664-47d5-a173-c0f1c9eab13c/JACINDA+Loveseat+0.png' },
  { name: 'ROWNTREE LOVESEAT', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393208199-T1PV7YUR0DLMIF03FSXK/ROWNTREE_Loveseat_0.png' },
  { name: 'ELOISE FRENCH LOVESEAT', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1642724370744-JL953ZD8GFE7QC7RBMC7/ELOISE+French+Loveseat+0.png' },
  { name: 'CICELY LOVESEAT', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1650311313546-NRFYLFU1Y7D9M4OC5BRE/CICELY+Loveseat.png' },
  
  // Chairs
  { name: 'BENECIO CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676666187274-VNLZY6S29QS7GVFE6CFK/BENECIO+Chair+0.png' },
  { name: 'NOELLE CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1658342828449-TLTXXTHAMMULSAHUJQIL/NOELLE+Chair+0.png' },
  { name: 'FABIAN CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665346988-PJ2JRJ458RTW54N6BP5S/FABIAN+Chair+0.png' },
  { name: 'PHILLIPE CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392561544-NQBPAEREQYDBVA1BQUC5/PHILLIPE_Chair_0.png' },
  { name: 'FAWN CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392541345-5CG504FJQ6OW32LXPNWB/FAWN_Chair_0.png' },
  { name: 'JESAMAY CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/816f0324-a0ae-4d77-beeb-dc9686e2a3d1/JESAMAY+Chair+0.png' },
  { name: 'NOMAD CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392559367-97Z0Y25TANXEVYRKKMO0/NOMAD_Chair_0.png' },
  { name: 'ARTESIA CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/f0062682-3bd9-4849-be9a-e487a76c3810/ARTESIA+Chair+0.png' },
  { name: 'FORD CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/5dbbb82f-cd30-4d9c-ad9e-02847607e2a3/FORD+Chair+0.png' },
  { name: 'BARD CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1666026869300-S6U7LE5P33EGBC13NCJK/BARD+Chair+0.png' },
  { name: 'AMUN CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png' },
  { name: 'POE CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392562230-MGXXYP0I9K9CXM2HEXR5/POE_Chair_0.png' },
  { name: 'SUHANA CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1636060835663-ZKE6S5O0EF88Z6F249HP/SUHANA+Chair+0.png' },
  { name: 'AZALEA VELVET CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c0051acf-b145-467d-b3f5-a952c483dddd/AZALEA+Velvet+Chair+0.png' },
  { name: 'NATORI CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665051110-7IUCLX9YCHTCS08R9DVG/NATORI+Chair+0.png' },
  { name: 'FLORIAN CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665444650-8HKE3JU46DE5OVOLPNLN/FLORIAN+Chair+0.png' },
  { name: 'ARAMITA CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665246663-S7UVBWTTY63ZYJYL9L7T/ARAMITA+Chair+0.png' },
  { name: 'CORWIN CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392539804-4LSL3IC56ZB7YVFL6776/CORWIN_Chair_0.png' },
  { name: 'ADELAIDE CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674072566107-66V4ZXFHFYRCO0PAMMIG/ADELAIDE+Chair.png' },
  { name: 'HELENA CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674072794180-9XV2QJMFJFSZ5MMLEGPC/HELENA+Chair.png' },
  { name: 'JENNIE CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674072932225-4QYY2VB22O1O57GUUB03/JENNIE+Chair.png' },
  { name: 'MILLICENT CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674073144580-UUZ27P55RXYAJA20ORBC/MILLICENT+Chair.png' },
  { name: 'ROSIE CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674073249340-1E4T8JBBAX2CQLUAW8YQ/ROSIE+Chair.png' },
  { name: 'CARWYN CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1650315173339-OBD2FVBDM4JP5PHBUJFE/CARWYN+Chair.png' },
  { name: 'ALORA BOTANICAL CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/6b9f5d42-2d86-496f-8e57-9c45926d7e8c/ALORA+Botanical+Chair+0.png' },
  { name: 'DONNELLY CHAIR', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674247407527-YRP6LAG273WXOGG5KSKN/DONNELLY+Chair+0.png' },
  
  // Benches
  { name: 'YGRITTE BENCH', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393264866-D3ZC95A546OFHHU26P4H/YGRITTE_Bench_0.png' },
  { name: 'ALISTAIR BENCH', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/adc386e0-2123-4acf-b37f-aa3f93df2467/ALISTAIR+Bench.png' },
  { name: 'JOURDAIN BENCH', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665665138-RMTD0NVSXPG16BY2HUIE/JOURDAIN+Bench+0.png' },
  { name: 'AVALON BENCH', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665585039-N1QQ6XY4NO9U6OQZS4PA/AVALON+Bench+0.png' },
  { name: 'DUNE BENCH', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/6d223cd6-05bf-4755-a2bb-fff26e13a452/DUNE+Bench+0.png' },
  { name: 'GERALDINE BENCH', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
  
  // Ottomans
  { name: 'TORRO OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676671839468-GXNV9GOA2NWJEBMB237S/TORRO+Ottoman+0.png' },
  { name: 'MORRISON OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393257537-H14GYO650OVBK1HJN1NZ/MORRISON_Ottoman_0.png' },
  { name: 'JESSE OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393254929-OOYG9DIM926MKOS7LL98/JESSE_Ottoman_0.png' },
  { name: 'EVANDER OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676671475776-NAI1NUURRXNHZZXSYCOB/EVANDER+Ottoman+0.png' },
  { name: 'BLANC OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393243597-KA9UEJWDU2W1FGZ4YPFI/BLANC_Ottoman_0.png' },
  { name: 'ELLORA OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1714164737742-ZNYPZF8GHX29G7AQKAD5/ELLORA+Ottoman+0.png' },
  { name: 'LEANNA IVORY OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/05dc4531-0bc5-48b6-b990-4a3182d27c85/LEANNA+Ivory+Ottoman.png' },
  { name: 'LORENZO OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676671666700-X75POFNLMZHY9JLCKZ6Y/LORENZO+Ottoman+0.png' },
  { name: 'NAZARA GREY OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/d2f4a36b-c385-44e1-9c37-926b645b0ead/NAZARA+Grey+Ottoman.png' },
  { name: 'NERIYA IVORY OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/b9011390-7e3d-4100-bcae-532a3065d112/NERIYA+Ivory+Ottoman.png' },
  { name: 'SIETE OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c15f23a2-628f-4575-abdc-c5414709d4c7/SIETE+Ottoman.png' },
  { name: 'OMAR OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393259770-CK6LLSBG9UXZ02AVJU6R/OMAR_Ottoman_0.png' },
  { name: 'JOSEPH OTTOMAN', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393255561-IWR49LKBAJ9HS38VXNMR/JOSEPH_Ottoman_0.png' },
]

// Featured items for the New Arrivals carousel
export const NEW_ARRIVALS: Product[] = [
  INVENTORY[0],  // INDIWIN SOFA
  INVENTORY[2],  // STANHOPE SOFA
  INVENTORY[18], // COSETTE LOVESEAT
  INVENTORY[26], // BENECIO CHAIR
  INVENTORY[52], // YGRITTE BENCH
  INVENTORY[58], // TORRO OTTOMAN
  INVENTORY[5],  // HENRY SOFA
  INVENTORY[11], // CALISTA FRINGE SOFA
  INVENTORY[27], // NOELLE CHAIR
  INVENTORY[33], // ARTESIA CHAIR
  INVENTORY[53], // ALISTAIR BENCH
  INVENTORY[62], // ELLORA OTTOMAN
]
