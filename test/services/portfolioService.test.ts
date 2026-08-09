import { describe, it, expect } from 'vitest';
import { portfolioService } from './portfolioService';

describe('portfolioService', () => {
  it('should fetch engineer info', async () => {
    const engineer = await portfolioService.getEngineerInfo();
    expect(engineer).toBeDefined();
    expect(engineer.name).toBe('Christelle Mamekem Ngueguim');
    expect(engineer.email).toBe('mnchristelle@gmail.com');
  });

  it('should fetch work experiences', async () => {
    const experiences = await portfolioService.getExperiences();
    expect(Array.isArray(experiences)).toBe(true);
    expect(experiences.length).toBeGreaterThan(0);
    expect(experiences[0].role).toBeDefined();
  });

  it('should fetch projects including PEPPOL E-Invoicing Engine', async () => {
    const projects = await portfolioService.getProjects();
    expect(Array.isArray(projects)).toBe(true);
    const peppolProj = projects.find((p) => p.id === 'proj-peppol-einvoicing');
    expect(peppolProj).toBeDefined();
    expect(peppolProj?.title).toContain('PEPPOL');
    expect(peppolProj?.skills).toContain('UBL 2.1');
  });

  it('should fetch languages and hobbies', async () => {
    const languages = await portfolioService.getLanguages();
    const hobbies = await portfolioService.getHobbies();
    expect(languages.some((l) => l.name === 'French')).toBe(true);
    expect(hobbies.length).toBeGreaterThan(0);
  });
});
