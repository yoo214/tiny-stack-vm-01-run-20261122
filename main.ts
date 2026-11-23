// Tiny stack VM, make.fun ISA v1. Node 22, no deps.
import{readFileSync as R,writeFileSync as W,mkdirSync as M}from"node:fs";
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
for(let i=1;i<41;i++){
let d="i"+("00"+i).slice(-3),p=R(`${I}/${d}/program.bin`),q=R(`${I}/${d}/input.bin`),n=p.length,
S=new Int32Array(256),C=new Int32Array(64),E=S.slice(),o=new Uint8Array(65536),
s=0,c=0,l=0,pc=0,t=0,e=0,j=0;
for(;;){
if(t==1e6){e=10;break}
if(pc<0||pc>=n){e=9;break}
let g=p[pc];
if(g>83||g>65&&g<80||g>52&&g<64||g>34&&g<48||g>7&&g<16){e=5;break}
let m=g==1?1:g==2?4:g>47&&g<52?2:0;
if(pc+m>=n){e=9;break}
t++;
let k=pc+1+m;
let po=g==7?3:g==5||g==6||g==65||g>15&&g<35&&g!=23&&g!=27?2:g==3||g==4||g==23||g==27||g==49||g==50||g==64||g==80||g==81||g==83?1:0;
let pu=g==6?3:g==4||g==5?2:g==1||g==2||g==82||g==64||g>15&&g<35?1:0;
if(s<po){e=2;break}
if(s-po+pu>256){e=3;break}
pc=k;
if(!g){e=0;break}
else if(g==1)S[s++]=(p[k-1]<<24)>>24;
else if(g==2)S[s++]=p[k-4]|p[k-3]<<8|p[k-2]<<16|p[k-1]<<24;
else if(g==3)s--;
else if(g==4){S[s]=S[s-1];s++}
else if(g==5){let a=S[s-1];S[s-1]=S[s-2];S[s-2]=a}
else if(g==6){S[s]=S[s-2];s++}
else if(g==7){let a=S[s-3];S[s-3]=S[s-2];S[s-2]=S[s-1];S[s-1]=a}
else if(g==23)S[s-1]=-S[s-1]|0;
else if(g==27)S[s-1]=~S[s-1];
else if(g>15&&g<35){
let b=S[s-1],a=S[s-2];
if(!b&&(g==19||g==20||g==21||g==22)){e=4;break}
let r=g==16?(a+b)|0:g==17?(a-b)|0:g==18?Math.imul(a,b):g==19?a==-2147483648&&b==-1?a:(a/b)|0:g==20?b==-1?0:a%b|0:g==21?Math.floor((a>>>0)/(b>>>0))|0:g==22?(a>>>0)%(b>>>0)|0:g==24?a&b:g==25?a|b:g==26?a^b:g==28?a<<(b&31):g==29?a>>(b&31):g==30?(a>>>(b&31))|0:g==32?a==b?1:0:g==33?a<b?1:0:(a>>>0)<(b>>>0)?1:0;
s-=2;S[s++]=r;
}
else if(g>47&&g<51){
let y=(p[k-2]|p[k-1]<<8)<<16>>16,z=1;
if(g!=48){let v=S[--s];z=g==49?v==0:v!=0}
if(z)pc=k+y;
}
else if(g==51){
if(c==64){e=7;break}
C[c++]=k;pc=p[k-2]|p[k-1]<<8;
}
else if(g==52){
if(!c){e=8;break}
pc=C[--c];
}
else if(g==64){
let a=S[s-1];
if(a<0||a>255){e=6;break}
S[s-1]=E[a];
}
else if(g==65){
let a=S[s-1],v=S[s-2];
if(a<0||a>255){e=6;break}
s-=2;E[a]=v;
}
else if(g==80){
let f=String(S[s-1]);
if(l+f.length>65536){e=11;break}
s--;for(let h=0;h<f.length;h++)o[l++]=f.charCodeAt(h);
}
else if(g==81){
if(l+1>65536){e=11;break}
o[l++]=S[--s]&255;
}
else if(g==82)S[s++]=j<q.length?q[j++]:-1;
else if(g==83){e=S[--s]&255;break}
}
M(`${O}/${d}`,{recursive:true});
W(`${O}/${d}/stdout.bin`,o.subarray(0,l));
W(`${O}/${d}/exit.txt`,e+"\n");
}
