 exports.convertToSlug = (title) => {
    // Convert to lowercase
    let slug = title.toLowerCase();
    
    // Remove all special characters except for spaces and hyphens
    slug = slug.replace(/[^a-z0-9\s-]/g, '');
    
    // Replace spaces with hyphens
    slug = slug.replace(/\s+/g, '-');
    
    // Remove multiple hyphens
    slug = slug.replace(/-+/g, '-');
    
    // Trim hyphens from the start and end
    slug = slug.replace(/^-+|-+$/g, '');
    
    return slug;
  }