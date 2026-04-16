export type Category = 'All' | 'Sofas' | 'Loveseats' | 'Chairs' | 'Benches' | 'Ottomans'
export type Color = 'Ivory' | 'Cream' | 'White' | 'Charcoal' | 'Black' | 'Grey' | 'Cognac' | 'Brown' | 'Tan' | 'Sage' | 'Green' | 'Olive' | 'Blush' | 'Navy' | 'Gold' | 'Natural'
export type Finish = 'Velvet' | 'Linen' | 'Leather' | 'Bouclé' | 'Cotton' | 'Wood' | 'Rattan' | 'Cane' | 'Metal' | 'Brass' | 'Iron'

export interface Product {
  name: string
  category: Category | string
  image: string
  color?: Color[]
  finish?: Finish[]
  isNew?: boolean
  quantity?: number
}

export const CATEGORIES: Category[] = ['All', 'Sofas', 'Loveseats', 'Chairs', 'Benches', 'Ottomans']
export const COLORS: Color[] = ['Ivory', 'Cream', 'White', 'Charcoal', 'Black', 'Grey', 'Cognac', 'Brown', 'Tan', 'Sage', 'Green', 'Natural']
export const FINISHES: Finish[] = ['Velvet', 'Linen', 'Leather', 'Bouclé', 'Cotton', 'Wood', 'Rattan', 'Cane', 'Metal', 'Brass', 'Iron']

export const INVENTORY: Product[] = [
  // Sofas
  { name: 'INDIWIN SOFA', category: 'Sofas', color: ['Black'], finish: ['Leather', 'Metal'], isNew: true, quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393201962-4E4HKZNINTLTPTQE7Z8O/INDIWIN_Sofa_0.png' },
  { name: 'BROOKLYN SOFA', category: 'Sofas', color: ['Charcoal'], finish: ['Velvet', 'Brass'], quantity: 3, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393192804-GCYSRGVJ8BJOCF3G6AKM/BROOKLYN_Sofa_0.png' },
  { name: 'STANHOPE SOFA', category: 'Sofas', color: ['Ivory'], finish: ['Linen', 'Wood'], isNew: true, quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674246744572-OWQALDPC7UF01CB3TM98/STANHOPE+Sofa.png' },
  { name: 'SYLVANUS SOFA', category: 'Sofas', color: ['Sage'], finish: ['Velvet', 'Wood'], quantity: 1, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1636058750911-1JRVRUJZ46B0XLBQOUFS/SYLVANUS+Sofa+0.png' },
  { name: 'SILAS CANE SOFA', category: 'Sofas', color: ['Natural', 'Ivory'], finish: ['Cane', 'Linen'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1650311158276-CAYBN7BTVUKPJ65QGQ8P/SILAS+Cane+Sofa+0.png' },
  { name: 'HENRY SOFA', category: 'Sofas', color: ['Grey'], finish: ['Velvet', 'Wood'], isNew: true, quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/9f9ccadd-8ec1-4113-aa09-8d1220e5ea48/HENRY+Sofa+0.png' },
  { name: 'LINDT SOFA', category: 'Sofas', color: ['Cognac', 'Brown'], finish: ['Leather', 'Metal'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393204231-W79P4V24URXTZREUL8H6/LINDT_Sofa_0.png' },
  { name: 'RESHMA BOTANICAL SOFA', category: 'Sofas', color: ['Green', 'Natural'], finish: ['Cotton', 'Wood'], quantity: 1, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/5166c92a-373f-4fb8-ba20-74feed2e95ef/RESHMA+Botanical+Sofa+0.png' },
  { name: 'AVIANA LINEN SOFA', category: 'Sofas', color: ['Ivory', 'Cream'], finish: ['Linen', 'Wood'], quantity: 3, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/2fb4d229-116b-4439-a127-c0c64c95d3e8/AVIANA+Linen+Sofa+0.png' },
  { name: 'GWENEVERE DAYBED', category: 'Sofas', color: ['Ivory'], finish: ['Linen', 'Metal'], quantity: 1, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393266272-VZKU6C4S9WI7LNC14A75/GWENEVERE_Daybed_0.png' },
  { name: 'ELIZABETH SOFA', category: 'Sofas', color: ['Charcoal'], finish: ['Velvet', 'Wood'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/9da8dac2-d0b4-442a-9731-d7a8ef9af204/ELIZABETH+Sofa+0.png' },
  { name: 'CALISTA FRINGE SOFA', category: 'Sofas', color: ['Cream', 'Ivory'], finish: ['Bouclé', 'Wood'], isNew: true, quantity: 1, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/b0b6364a-c683-4a5c-93f2-26ca4e1a1d85/CALISTA+Fringe+Sofa+0.png' },
  { name: 'ROSALIND DONUT SECTIONAL', category: 'Sofas', color: ['Cream'], finish: ['Bouclé'], quantity: 1, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/2f90aa29-7724-4b57-81c6-500b8e6dc35d/ROSALIND+Donut+Sectional.png' },
  { name: 'ERIN FRENCH SOFA', category: 'Sofas', color: ['White', 'Natural'], finish: ['Linen', 'Wood'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1642724211971-EQ891G6HN5GM6MOGZ18W/ERIN+French+Sofa.png' },
  { name: 'SIDONY SOFA', category: 'Sofas', color: ['Natural', 'Tan'], finish: ['Rattan', 'Linen'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674675848145-7SCTYSZ3AJ6Z6A987MZZ/SIDONY+Sofa+0.png' },
  { name: 'TALON SOFA', category: 'Sofas', color: ['Natural', 'Ivory'], finish: ['Rattan', 'Cotton'], quantity: 3, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393210705-JO0E30UY5SYVT0UISJBN/TALON_Sofa_0.png' },
  { name: 'LAGOS', category: 'Sofas', color: ['Charcoal', 'Black'], finish: ['Leather', 'Metal'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/3f087437-7f6d-4234-9bd0-ed45bd9a9254/LAGOS+0.png' },
  { name: 'FULTON', category: 'Sofas', color: ['Tan', 'Brown'], finish: ['Leather', 'Wood'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/11b30ad1-48f5-4a7d-8883-40f69109bc7b/FULTON+0.png' },
  
  // Loveseats
  { name: 'COSETTE LOVESEAT', category: 'Loveseats', color: ['Sage', 'Green'], finish: ['Velvet', 'Metal'], isNew: true, quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c8ac9355-3736-43f6-bfc5-c64ca7adc3cf/COSETTE+Loveseat+0.png' },
  { name: 'PHILLIPE LOVESEAT', category: 'Loveseats', color: ['Grey'], finish: ['Velvet', 'Metal'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c2465c76-e9a5-42e4-a40a-b678f315eb04/PHILLIPE+Loveseat+0.png' },
  { name: 'ANTONELLA LOVESEAT', category: 'Loveseats', color: ['Ivory', 'Cream'], finish: ['Velvet', 'Wood'], quantity: 3, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676671956492-JY9LKWXFNL9DDQAQO719/ANTONELLA+Loveseat+0.png' },
  { name: 'COMMODORE LOVESEAT', category: 'Loveseats', color: ['Tan', 'Natural'], finish: ['Cotton', 'Metal'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png' },
  { name: 'JACINDA LOVESEAT', category: 'Loveseats', color: ['Natural', 'Tan'], finish: ['Linen', 'Metal'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c94dd17d-0664-47d5-a173-c0f1c9eab13c/JACINDA+Loveseat+0.png' },
  { name: 'ROWNTREE LOVESEAT', category: 'Loveseats', color: ['Cognac', 'Brown'], finish: ['Leather', 'Metal'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393208199-T1PV7YUR0DLMIF03FSXK/ROWNTREE_Loveseat_0.png' },
  { name: 'ELOISE FRENCH LOVESEAT', category: 'Loveseats', color: ['White', 'Ivory'], finish: ['Linen', 'Wood'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1642724370744-JL953ZD8GFE7QC7RBMC7/ELOISE+French+Loveseat+0.png' },
  { name: 'CICELY LOVESEAT', category: 'Loveseats', color: ['Natural'], finish: ['Cane', 'Linen'], quantity: 1, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1650311313546-NRFYLFU1Y7D9M4OC5BRE/CICELY+Loveseat.png' },
  
  // Chairs
  { name: 'BENECIO CHAIR', category: 'Chairs', color: ['Charcoal'], finish: ['Velvet', 'Metal'], isNew: true, quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676666187274-VNLZY6S29QS7GVFE6CFK/BENECIO+Chair+0.png' },
  { name: 'NOELLE CHAIR', category: 'Chairs', color: ['Ivory', 'Cream'], finish: ['Bouclé', 'Brass'], isNew: true, quantity: 8, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1658342828449-TLTXXTHAMMULSAHUJQIL/NOELLE+Chair+0.png' },
  { name: 'FABIAN CHAIR', category: 'Chairs', color: ['Grey'], finish: ['Velvet', 'Metal'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665346988-PJ2JRJ458RTW54N6BP5S/FABIAN+Chair+0.png' },
  { name: 'PHILLIPE CHAIR', category: 'Chairs', color: ['Grey'], finish: ['Velvet', 'Metal'], quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392561544-NQBPAEREQYDBVA1BQUC5/PHILLIPE_Chair_0.png' },
  { name: 'FAWN CHAIR', category: 'Chairs', color: ['Cognac', 'Brown'], finish: ['Leather', 'Metal'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392541345-5CG504FJQ6OW32LXPNWB/FAWN_Chair_0.png' },
  { name: 'JESAMAY CHAIR', category: 'Chairs', color: ['Natural'], finish: ['Rattan', 'Wood'], quantity: 8, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/816f0324-a0ae-4d77-beeb-dc9686e2a3d1/JESAMAY+Chair+0.png' },
  { name: 'NOMAD CHAIR', category: 'Chairs', color: ['Natural', 'Brown'], finish: ['Leather', 'Wood'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392559367-97Z0Y25TANXEVYRKKMO0/NOMAD_Chair_0.png' },
  { name: 'ARTESIA CHAIR', category: 'Chairs', color: ['Natural'], finish: ['Cane', 'Wood'], isNew: true, quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/f0062682-3bd9-4849-be9a-e487a76c3810/ARTESIA+Chair+0.png' },
  { name: 'FORD CHAIR', category: 'Chairs', color: ['Natural', 'Tan'], finish: ['Rattan', 'Metal'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/5dbbb82f-cd30-4d9c-ad9e-02847607e2a3/FORD+Chair+0.png' },
  { name: 'BARD CHAIR', category: 'Chairs', color: ['Grey'], finish: ['Velvet', 'Metal'], quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1666026869300-S6U7LE5P33EGBC13NCJK/BARD+Chair+0.png' },
  { name: 'AMUN CHAIR', category: 'Chairs', color: ['White', 'Ivory'], finish: ['Leather', 'Metal'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png' },
  { name: 'POE CHAIR', category: 'Chairs', color: ['Natural'], finish: ['Rattan', 'Cane'], quantity: 8, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392562230-MGXXYP0I9K9CXM2HEXR5/POE_Chair_0.png' },
  { name: 'SUHANA CHAIR', category: 'Chairs', color: ['Gold', 'Natural'], finish: ['Velvet', 'Metal'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1636060835663-ZKE6S5O0EF88Z6F249HP/SUHANA+Chair+0.png' },
  { name: 'AZALEA VELVET CHAIR', category: 'Chairs', color: ['Sage', 'Green'], finish: ['Velvet', 'Metal'], quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c0051acf-b145-467d-b3f5-a952c483dddd/AZALEA+Velvet+Chair+0.png' },
  { name: 'NATORI CHAIR', category: 'Chairs', color: ['Natural', 'Tan'], finish: ['Wood', 'Cotton'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665051110-7IUCLX9YCHTCS08R9DVG/NATORI+Chair+0.png' },
  { name: 'FLORIAN CHAIR', category: 'Chairs', color: ['Grey'], finish: ['Velvet', 'Brass'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665444650-8HKE3JU46DE5OVOLPNLN/FLORIAN+Chair+0.png' },
  { name: 'ARAMITA CHAIR', category: 'Chairs', color: ['Natural'], finish: ['Wood', 'Linen'], quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665246663-S7UVBWTTY63ZYJYL9L7T/ARAMITA+Chair+0.png' },
  { name: 'CORWIN CHAIR', category: 'Chairs', color: ['Cognac'], finish: ['Leather', 'Wood'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392539804-4LSL3IC56ZB7YVFL6776/CORWIN_Chair_0.png' },
  { name: 'ADELAIDE CHAIR', category: 'Chairs', color: ['Grey'], finish: ['Velvet', 'Metal'], quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674072566107-66V4ZXFHFYRCO0PAMMIG/ADELAIDE+Chair.png' },
  { name: 'HELENA CHAIR', category: 'Chairs', color: ['Ivory'], finish: ['Bouclé', 'Metal'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674072794180-9XV2QJMFJFSZ5MMLEGPC/HELENA+Chair.png' },
  { name: 'JENNIE CHAIR', category: 'Chairs', color: ['Charcoal'], finish: ['Velvet', 'Metal'], quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674072932225-4QYY2VB22O1O57GUUB03/JENNIE+Chair.png' },
  { name: 'MILLICENT CHAIR', category: 'Chairs', color: ['Natural'], finish: ['Cane', 'Wood'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674073144580-UUZ27P55RXYAJA20ORBC/MILLICENT+Chair.png' },
  { name: 'ROSIE CHAIR', category: 'Chairs', color: ['Ivory', 'Cream'], finish: ['Bouclé', 'Wood'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674073249340-1E4T8JBBAX2CQLUAW8YQ/ROSIE+Chair.png' },
  { name: 'CARWYN CHAIR', category: 'Chairs', color: ['Natural'], finish: ['Rattan', 'Wood'], quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1650315173339-OBD2FVBDM4JP5PHBUJFE/CARWYN+Chair.png' },
  { name: 'ALORA BOTANICAL CHAIR', category: 'Chairs', color: ['Green', 'Natural'], finish: ['Cotton', 'Wood'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/6b9f5d42-2d86-496f-8e57-9c45926d7e8c/ALORA+Botanical+Chair+0.png' },
  { name: 'DONNELLY CHAIR', category: 'Chairs', color: ['Natural', 'Tan'], finish: ['Rattan', 'Metal'], quantity: 8, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1674247407527-YRP6LAG273WXOGG5KSKN/DONNELLY+Chair+0.png' },
  
  // Benches
  { name: 'YGRITTE BENCH', category: 'Benches', color: ['Ivory'], finish: ['Linen', 'Metal'], isNew: true, quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393264866-D3ZC95A546OFHHU26P4H/YGRITTE_Bench_0.png' },
  { name: 'ALISTAIR BENCH', category: 'Benches', color: ['Charcoal'], finish: ['Velvet', 'Brass'], isNew: true, quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/adc386e0-2123-4acf-b37f-aa3f93df2467/ALISTAIR+Bench.png' },
  { name: 'JOURDAIN BENCH', category: 'Benches', color: ['Ivory', 'Cream'], finish: ['Velvet', 'Metal'], quantity: 3, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665665138-RMTD0NVSXPG16BY2HUIE/JOURDAIN+Bench+0.png' },
  { name: 'AVALON BENCH', category: 'Benches', color: ['Cognac', 'Brown'], finish: ['Leather', 'Metal'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676665585039-N1QQ6XY4NO9U6OQZS4PA/AVALON+Bench+0.png' },
  { name: 'DUNE BENCH', category: 'Benches', color: ['Natural', 'Cream'], finish: ['Linen', 'Wood'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/6d223cd6-05bf-4755-a2bb-fff26e13a452/DUNE+Bench+0.png' },
  { name: 'GERALDINE BENCH', category: 'Benches', color: ['Ivory'], finish: ['Velvet', 'Brass'], quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
  
  // Ottomans
  { name: 'TORRO OTTOMAN', category: 'Ottomans', color: ['Brown', 'Cognac'], finish: ['Leather'], isNew: true, quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676671839468-GXNV9GOA2NWJEBMB237S/TORRO+Ottoman+0.png' },
  { name: 'MORRISON OTTOMAN', category: 'Ottomans', color: ['Grey'], finish: ['Velvet', 'Wood'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393257537-H14GYO650OVBK1HJN1NZ/MORRISON_Ottoman_0.png' },
  { name: 'JESSE OTTOMAN', category: 'Ottomans', color: ['Charcoal'], finish: ['Velvet', 'Metal'], quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393254929-OOYG9DIM926MKOS7LL98/JESSE_Ottoman_0.png' },
  { name: 'EVANDER OTTOMAN', category: 'Ottomans', color: ['Ivory', 'Cream'], finish: ['Bouclé', 'Metal'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676671475776-NAI1NUURRXNHZZXSYCOB/EVANDER+Ottoman+0.png' },
  { name: 'BLANC OTTOMAN', category: 'Ottomans', color: ['White', 'Ivory'], finish: ['Linen', 'Wood'], quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393243597-KA9UEJWDU2W1FGZ4YPFI/BLANC_Ottoman_0.png' },
  { name: 'ELLORA OTTOMAN', category: 'Ottomans', color: ['Natural'], finish: ['Rattan'], isNew: true, quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1714164737742-ZNYPZF8GHX29G7AQKAD5/ELLORA+Ottoman+0.png' },
  { name: 'LEANNA IVORY OTTOMAN', category: 'Ottomans', color: ['Ivory'], finish: ['Velvet', 'Wood'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/05dc4531-0bc5-48b6-b990-4a3182d27c85/LEANNA+Ivory+Ottoman.png' },
  { name: 'LORENZO OTTOMAN', category: 'Ottomans', color: ['Cognac'], finish: ['Leather', 'Metal'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1676671666700-X75POFNLMZHY9JLCKZ6Y/LORENZO+Ottoman+0.png' },
  { name: 'NAZARA GREY OTTOMAN', category: 'Ottomans', color: ['Grey'], finish: ['Velvet', 'Brass'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/d2f4a36b-c385-44e1-9c37-926b645b0ead/NAZARA+Grey+Ottoman.png' },
  { name: 'NERIYA IVORY OTTOMAN', category: 'Ottomans', color: ['Ivory', 'Cream'], finish: ['Velvet', 'Metal'], quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/b9011390-7e3d-4100-bcae-532a3065d112/NERIYA+Ivory+Ottoman.png' },
  { name: 'SIETE OTTOMAN', category: 'Ottomans', color: ['Brown', 'Natural'], finish: ['Leather', 'Wood'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c15f23a2-628f-4575-abdc-c5414709d4c7/SIETE+Ottoman.png' },
  { name: 'OMAR OTTOMAN', category: 'Ottomans', color: ['Natural', 'Brown'], finish: ['Leather'], quantity: 6, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393259770-CK6LLSBG9UXZ02AVJU6R/OMAR_Ottoman_0.png' },
  { name: 'JOSEPH OTTOMAN', category: 'Ottomans', color: ['Cognac'], finish: ['Leather', 'Wood'], quantity: 4, image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393255561-IWR49LKBAJ9HS38VXNMR/JOSEPH_Ottoman_0.png' },
]

// Featured items for the New Arrivals carousel - filter by isNew flag
export const NEW_ARRIVALS: Product[] = INVENTORY.filter(p => p.isNew)
