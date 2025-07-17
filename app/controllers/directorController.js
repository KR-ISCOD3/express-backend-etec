
export const sharedAction = (req, res) => {
    res.json({ message: 'Visible to director & assistant' });
  };
  
export const directorOnlyAction = (req, res) => {
    res.json({ message: 'Only for directors' });
};
  
export const printCertificate = (req, res) => {
    // your logic here
    res.json({ message: 'Certificate printed (only for director)' });
};
