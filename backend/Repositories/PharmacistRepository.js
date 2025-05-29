const supabase = require('../Config/supabaseClient');

async function getPharamacists() {
    const { data, error } = await supabase
    .from('pharmacists')
    .select('*');

    if(error)
        throw error;

    return data;
}

async function getPharmacistById(id) {
    const { data, error } = await supabase
    .from('pharmacists')
    .select('*')
    .eq('id', id)
    .single();

    if(error)
        throw error;

    return data;
}
async function getPharmacistByEmail(email) {
    const { data, error } = await supabase
    .from('pharmacists')
    .select('*')
    .eq('email', email)
    .single();

    if(error && error.code !== 'PGRST116')
        throw error;

    return data;
}

async function createpharmacists(pharmacist) {
    const { data, error } = await supabase
    .from('pharmacists')
    .insert([pharmacist])                        
    .single();                            
    if (error) throw error;
    return data;                             
}

async function removePharmacist(id) {
    const { error } = await supabase
    .from('pharmacists')
    .delete()
    .eq('id', id);
    if (error) throw error;                 
}

module.exports = {
    getPharamacists,
    getPharmacistById,
    getPharmacistByEmail,
    createpharmacists,
    removePharmacist,
}