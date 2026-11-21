// Add a template by defining its artwork class, palette and optional editable fields.
// Artwork should be owned or licensed for use in customer-facing templates.
export const templates = [
  {id:'midnight-garden',name:'Midnight Garden',style:'garden',palette:'midnight',category:'Classic'},
  {id:'sage-garden',name:'Sage Garden',style:'garden',palette:'sage',category:'Botanical'},
  {id:'rose-garden',name:'Rose Garden',style:'garden',palette:'rose',category:'Romantic'},
  {id:'ivory-arch',name:'Ivory Arch',style:'arch',palette:'ivory',category:'Minimal'},
  {id:'terracotta-arch',name:'Terracotta Arch',style:'arch',palette:'terracotta',category:'Modern'},
  {id:'celestial-night',name:'Celestial Night',style:'celestial',palette:'celestial',category:'Evening'},
];

export function getTemplate(id) {
  return templates.find(template => template.id === id) || templates[0];
}
