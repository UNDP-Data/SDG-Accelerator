import domtoimage from 'dom-to-image';

export const DownloadImage = (node: HTMLElement, filename: string) => {
  domtoimage
    .toPng(node, { height: node.scrollHeight, width: node.scrollWidth })
    .then((dataUrl: any) => {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    });
};
